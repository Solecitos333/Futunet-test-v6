/**
 * Futunet AI Gemini Fallback
 * Calls Gemini API directly from browser when Ollama is offline
 * Uses streaming via fetch + ReadableStream
 */
(function() {
  'use strict';
  
  const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
  const DEFAULT_MODEL = 'gemini-2.0-flash';
  
  const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42SW16UXU2MlNrdmROOXdiOTFUaUlmTnVzSEpyMXBablZOWEZfS0Z3NWVNN1E=';
  
  // System prompt for Futunet AI
  const SYSTEM_PROMPT = `Eres Futunet AI, el asistente de inteligencia artificial privado de Futunet, 
un proveedor de servicios de internet (ISP) en República Dominicana. 
Eres experto en redes, telecomunicaciones, soporte técnico y atención al cliente. 
Respondes en español dominicano de manera profesional pero amigable. 
Cuando no sepas algo, lo dices honestamente.`;
  
  function getApiKey() {
    // Try localStorage first, then default embedded key
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
        { name: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash ☁️', cloud: true },
        { name: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash ☁️', cloud: true },
        { name: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro ☁️', cloud: true }
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
      // Filter out empty messages and fix role mapping
      const contents = messages
        .filter(m => m.content && m.content.trim())
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
      
      // Ensure conversation starts with a user turn
      if (contents.length === 0 || contents[0].role !== 'user') {
        console.warn('Gemini: conversation must start with a user message');
        onError && onError(new Error('La conversación debe comenzar con un mensaje de usuario'));
        return null;
      }
      
      // Ensure conversation alternates roles (Gemini requirement)
      // If two consecutive same-role messages exist, merge them
      const mergedContents = [];
      for (const msg of contents) {
        if (mergedContents.length > 0 && mergedContents[mergedContents.length - 1].role === msg.role) {
          // Merge with previous
          mergedContents[mergedContents.length - 1].parts[0].text += '\n' + msg.parts[0].text;
        } else {
          mergedContents.push(msg);
        }
      }
      
      const url = `${GEMINI_API_BASE}/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`;
      
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: mergedContents,
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
        if (!response.ok) {
          return response.json().then(errData => {
            const msg = errData.error && errData.error.message
              ? errData.error.message
              : `Error HTTP ${response.status}`;
            throw new Error(msg);
          }).catch(() => {
            throw new Error(`Error HTTP ${response.status}`);
          });
        }
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
