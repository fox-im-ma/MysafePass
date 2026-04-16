"""
LLM Service - Integration with Ollama for local LLM capabilities
"""

import os
import requests
from typing import Optional, Dict, Any, List
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class LLMService:
    """Service for interacting with local Ollama LLM."""
    
    def __init__(
        self,
        ollama_url: str = "http://localhost:11434",
        model: str = "mistral",
        timeout: int = 30
    ):
        """
        Initialize LLM Service.
        
        Args:
            ollama_url: URL of the Ollama server
            model: Model name to use (e.g., 'mistral', 'neural-chat', 'llama2')
            timeout: Request timeout in seconds
        """
        self.ollama_url = ollama_url.rstrip('/')
        self.model = model
        self.timeout = timeout
        self.api_endpoint = f"{self.ollama_url}/api/generate"
        self._cache = {}
        
    def is_available(self) -> bool:
        """Check if Ollama server is available."""
        try:
            response = requests.get(
                f"{self.ollama_url}/api/tags",
                timeout=5
            )
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"Ollama server not available: {str(e)}")
            return False
    
    def get_available_models(self) -> List[str]:
        """Get list of available models from Ollama."""
        try:
            response = requests.get(
                f"{self.ollama_url}/api/tags",
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                return [model['name'].split(':')[0] for model in data.get('models', [])]
            return []
        except Exception as e:
            logger.error(f"Error getting models: {str(e)}")
            return []
    
    def generate(self, prompt: str, stream: bool = False) -> str:
        """
        Generate text using the LLM.
        
        Args:
            prompt: The input prompt
            stream: Whether to stream the response
            
        Returns:
            Generated text
        """
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,  # We handle non-streaming for simplicity
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 40
            }
            
            response = requests.post(
                self.api_endpoint,
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('response', '').strip()
            else:
                logger.error(f"LLM error: {response.status_code}")
                return ""
                
        except requests.Timeout:
            logger.error("LLM request timeout")
            return ""
        except Exception as e:
            logger.error(f"Error generating text: {str(e)}")
            return ""
    
    def analyze_password_strength(self, password: str) -> Dict[str, Any]:
        """
        Analyze password strength and detect potential issues.
        
        Args:
            password: The password to analyze
            
        Returns:
            Dictionary with analysis results
        """
        # Create a cache key to avoid redundant API calls
        cache_key = f"pwd_analysis_{hash(password)}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        prompt = f"""Analyze this password for security: {password}

Provide a JSON response with:
1. strength_score (0-100)
2. has_sensitive_data (true/false) - check for common personal info patterns
3. risks (array of identified risks)
4. recommendations (array of improvement suggestions)
5. entropy_estimate (rough estimate of password entropy)

Keep your response concise and structured."""

        response = self.generate(prompt)
        
        try:
            # Parse JSON response
            import json
            # Clean up the response in case it has markdown formatting
            if '```json' in response:
                response = response.split('```json')[1].split('```')[0]
            elif '```' in response:
                response = response.split('```')[1].split('```')[0]
            
            result = json.loads(response)
        except Exception as e:
            logger.warning(f"Failed to parse LLM response: {str(e)}")
            result = {
                "strength_score": 0,
                "has_sensitive_data": False,
                "risks": [],
                "recommendations": [],
                "entropy_estimate": "unknown"
            }
        
        self._cache[cache_key] = result
        return result
    
    def check_sensitive_data_injection(self, password: str) -> Dict[str, Any]:
        """
        Check if password contains sensitive data like usernames, emails, etc.
        
        Args:
            password: The password to check
            
        Returns:
            Dictionary with detected sensitive data patterns
        """
        prompt = f"""Check if this password contains sensitive personal data patterns:
{password}

Identify any of these patterns:
- Email addresses
- Phone numbers
- Birthdates
- Common names
- Usernames
- Social numbers
- URLs

Return a JSON with:
- detected_patterns (array)
- severity (low/medium/high)
- explanation (brief explanation)
- should_reject (true/false - recommend rejecting password)"""

        response = self.generate(prompt)
        
        try:
            import json
            # Clean up the response
            if '```json' in response:
                response = response.split('```json')[1].split('```')[0]
            elif '```' in response:
                response = response.split('```')[1].split('```')[0]
            
            result = json.loads(response)
        except Exception as e:
            logger.warning(f"Failed to parse sensitive data check: {str(e)}")
            result = {
                "detected_patterns": [],
                "severity": "unknown",
                "explanation": "Unable to analyze",
                "should_reject": False
            }
        
        return result
    
    def answer_security_question(self, question: str, context: Optional[Dict] = None) -> str:
        """
        Answer security-related questions.
        
        Args:
            question: The security question
            context: Optional context about the user or situation
            
        Returns:
            Answer to the question
        """
        system_prompt = """You are a cybersecurity expert assistant. Answer security questions 
clearly, accurately, and concisely. Focus on practical advice for password managers and vault security.
Always respond in the same language as the question."""
        
        full_prompt = f"{system_prompt}\n\nQuestion: {question}"
        if context:
            full_prompt += f"\n\nContext: {context}"
        
        return self.generate(full_prompt)
    
    def rate_limit_check(self) -> bool:
        """Check if we should continue making requests (simple rate limiting)."""
        # Simple rate limiting - could be enhanced
        return True
