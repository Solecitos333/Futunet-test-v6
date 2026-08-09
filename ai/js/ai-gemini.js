/**
 * Futunet AI Gemini Fallback
 * Calls Gemini API directly from browser when Ollama is offline
 * Uses streaming via fetch + ReadableStream
 */
(function() {
  'use strict';
  
  const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
  const DEFAULT_MODEL = 'gemini-2.5-flash';
  
  const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42SW16UXU2MlNrdmROOXdiOTFUaUlmTnVzSEpyMXBablZOWEZfS0Z3NWVNN1E=';
  
  function getApiKey() {
    // Try localStorage first, then default
    return localStorage.getItem('futunet_gemini_key') || (typeof atob === 'function' ? atob(DEFAULT_KEY_B64) : '');
  }
  
  const AiGemini = {
    available: function() {
      return !!getApiKey();
    },
    
    setApiKey: function(key) {
      localStorage.setItem('futunet_gemini_key', key);
    },
    
    getApiKey: getApiKey,
    
    // List available Gemini models
    models: function() {
      return [
        { name: 'gemini-2.5-flash', displayName: 'Gemini 2.5 Flash ☁️', cloud: true },
        { name: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro ☁️', cloud: true }
      ];
    },
    
    // Send chat with streaming
    // messages: array of { role: 'user'|'assistant'|'model', content: string }
    // onChunk: callback(text) called for each chunk
    // onDone: callback(fullText) called when complete
    // onError: callback(error) called on error
    // Returns AbortController for cancellation
    chat: function(options) {
      const { model, messages, onChunk, onDone, onError, onThinking } = options;
      const apiKey = getApiKey();
      if (!apiKey) {
        onError && onError(new Error('Gemini API key not configured'));
        return null;
      }
      
      const controller = new AbortController();
      const geminiModel = model || DEFAULT_MODEL;
      
      // Convert messages to Gemini format
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const url = `${GEMINI_API_BASE}/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`;
      
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 8192
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
        }),
        signal: controller.signal
      })
      .then(response => {
        if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';
        
        function processStream() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              onDone && onDone(fullText);
              return;
            }
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.candidates && data.candidates[0]) {
                    const parts = data.candidates[0].content?.parts;
                    if (parts) {
                      for (const part of parts) {
                        if (part.thought && onThinking) {
                          onThinking(part.text || '');
                        } else if (part.text) {
                          fullText += part.text;
                          onChunk && onChunk(part.text);
                        }
                      }
                    }
                  }
                } catch(e) { /* skip invalid JSON */ }
              }
            }
            
            return processStream();
          });
        }
        
        return processStream();
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          onError && onError(err);
        }
      });
      
      return controller;
    }
  };
  
  window.AiGemini = AiGemini;
})();
