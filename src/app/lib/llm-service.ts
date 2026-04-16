/**
 * LLM Service - Frontend interface for LLM API
 */

import { apiClient } from './api';

export interface PasswordAnalysis {
  overall_score: number;
  recommendation: string;
  approved: boolean;
  basic_analysis: {
    length: number;
    has_uppercase: boolean;
    has_lowercase: boolean;
    has_digits: boolean;
    has_special: boolean;
    has_spaces: boolean;
    consecutive_chars: string[];
    repeated_chars: number;
    keyboard_patterns: string[];
    common_patterns: string[];
    entropy_bits: number;
  };
  sensitive_data_detected: {
    detected_patterns: string[];
    is_risky: boolean;
    pattern_count: number;
  };
  password_length: number;
}

export interface LLMStatus {
  available: boolean;
  current_model: string;
  available_models: string[];
  url: string;
}

export interface AIResponse {
  message: string;
  suggestions: string[];
  powered_by_llm?: boolean;
}

export interface AIContext {
  entries_count?: number;
  weak_entries?: Array<{ service: string; score: number }>;
  reused_count?: number;
  total_entries?: number;
  suspicious_entries?: Array<{ service: string; warning: string }>;
  entries?: Array<{ service: string; username: string }>;
}

export class LLMService {
  /**
   * Check password robustness and sensitive data injection
   */
  static async checkPassword(
    password: string,
    username?: string,
    email?: string
  ): Promise<PasswordAnalysis> {
    try {
      const response = await apiClient.request<{ success: boolean; analysis: PasswordAnalysis; error?: string }>(
        '/api/security/check-password',
        'POST',
        {
          password,
          username,
          email
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Password check failed');
      }

      return response.analysis;
    } catch (error) {
      console.error('Password check error:', error);
      throw error;
    }
  }

  /**
   * Get LLM status
   */
  static async getLLMStatus(): Promise<LLMStatus> {
    try {
      const response = await apiClient.request<LLMStatus>(
        '/api/ai/llm-status',
        'GET'
      );
      return response;
    } catch (error) {
      console.error('LLM status error:', error);
      return {
        available: false,
        current_model: 'unknown',
        available_models: [],
        url: 'http://localhost:11434'
      };
    }
  }

  /**
   * Send query to AI assistant
   */
  static async chat(
    query: string,
    context?: AIContext,
    useLLM: boolean = true
  ): Promise<AIResponse> {
    try {
      const response = await apiClient.request<{ success: boolean; response: AIResponse; error?: string }>(
        '/api/ai/chat',
        'POST',
        {
          query,
          context,
          use_llm: useLLM
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Chat failed');
      }

      return response.response;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }
}

export default LLMService;
