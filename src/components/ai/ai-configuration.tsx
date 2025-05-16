'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';

interface AIConfigurationProps {
  className?: string;
}

export function AIConfiguration({
  className = ''
}: AIConfigurationProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Mock AI configuration data
  const [config, setConfig] = useState({
    defaultProvider: 'openai',
    defaultModel: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: 'You are an educational assistant helping students and teachers with learning tasks. Always provide UK-curriculum aligned responses and use UK English spelling.',
    safetySettings: {
      contentFiltering: true,
      blockSensitiveTopics: true,
      ageAppropriate: 'school',
      profanityFilter: true
    },
    providers: {
      openai: {
        enabled: true,
        models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        defaultModel: 'gpt-4o'
      },
      anthropic: {
        enabled: true,
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        defaultModel: 'claude-3-opus'
      },
      gemini: {
        enabled: true,
        models: ['gemini-pro', 'gemini-ultra'],
        defaultModel: 'gemini-pro'
      },
      grok: {
        enabled: true,
        models: ['grok-1'],
        defaultModel: 'grok-1'
      },
      openrouter: {
        enabled: true,
        models: ['openai/gpt-4o', 'anthropic/claude-3-opus', 'meta/llama-3'],
        defaultModel: 'openai/gpt-4o'
      }
    },
    usageSettings: {
      rateLimit: 100,
      userQuota: {
        enabled: true,
        dailyLimit: 50,
        monthlyLimit: 1000
      },
      costManagement: {
        enabled: true,
        budgetCap: 100
      }
    },
    educationalSettings: {
      ageGroup: 'all',
      curriculumAlignment: 'uk_national',
      subjectSpecialization: false,
      difficultyAdaptation: true,
      feedbackStyle: 'constructive'
    }
  });
  
  // Handle configuration change
  const handleConfigChange = (section: string, setting: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value
      }
    }));
    setSaved(false);
  };
  
  // Handle nested configuration change
  const handleNestedConfigChange = (section: string, subsection: string, setting: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...prev[section as keyof typeof prev][subsection as any],
          [setting]: value
        }
      }
    }));
    setSaved(false);
  };
  
  // Handle direct setting change
  const handleSettingChange = (setting: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [setting]: value
    }));
    setSaved(false);
  };
  
  // Handle save configuration
  const handleSaveConfig = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      showToast({
        title: 'AI configuration saved',
        type: 'success'
      });
    }, 1000);
  };
  
  // Reset saved state when config changes
  useEffect(() => {
    setSaved(false);
  }, [config]);
  
  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">AI Provider Configuration</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Default AI Provider</label>
                <Select
                  options={[
                    { value: 'openai', label: 'OpenAI' },
                    { value: 'anthropic', label: 'Anthropic' },
                    { value: 'gemini', label: 'Google Gemini' },
                    { value: 'grok', label: 'GROK' },
                    { value: 'openrouter', label: 'OpenRouter' }
                  ]}
                  value={config.defaultProvider}
                  onChange={(value) => handleSettingChange('defaultProvider', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">The default AI provider to use when no specific provider is requested</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Model</label>
                <Select
                  options={[
                    { value: 'gpt-4o', label: 'GPT-4o' },
                    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
                    { value: 'gemini-pro', label: 'Gemini Pro' },
                    { value: 'grok-1', label: 'Grok-1' }
                  ]}
                  value={config.defaultModel}
                  onChange={(value) => handleSettingChange('defaultModel', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">The default model to use when no specific model is requested</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">System Prompt</label>
                <Textarea
                  value={config.systemPrompt}
                  onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                  className="w-full h-24"
                />
                <p className="text-xs text-gray-500 mt-1">Default system prompt to use for all AI interactions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Generation Parameters</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Temperature: {config.temperature}</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    value={config.temperature}
                    onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">2.0</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Controls randomness: lower values are more deterministic, higher values more creative</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Tokens</label>
                <Input 
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of tokens to generate in responses</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Top P: {config.topP}</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={config.topP}
                    onChange={(e) => handleSettingChange('topP', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">1.0</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Controls diversity via nucleus sampling</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Frequency Penalty: {config.frequencyPenalty}</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    value={config.frequencyPenalty}
                    onChange={(e) => handleSettingChange('frequencyPenalty', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">2.0</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Reduces repetition of token sequences</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Presence Penalty: {config.presencePenalty}</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    value={config.presencePenalty}
                    onChange={(e) => handleSettingChange('presencePenalty', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">2.0</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Reduces repetition of topics</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'safety',
      label: 'Safety & Compliance',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Content Safety Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable content filtering"
                  checked={config.safetySettings.contentFiltering}
                  onChange={(checked) => handleNestedConfigChange('safetySettings', 'safetySettings', 'contentFiltering', checked)}
                  description="Filter out potentially harmful or inappropriate content"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Block sensitive topics"
                  checked={config.safetySettings.blockSensitiveTopics}
                  onChange={(checked) => handleNestedConfigChange('safetySettings', 'safetySettings', 'blockSensitiveTopics', checked)}
                  description="Prevent responses on sensitive or controversial topics"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Enable profanity filter"
                  checked={config.safetySettings.profanityFilter}
                  onChange={(checked) => handleNestedConfigChange('safetySettings', 'safetySettings', 'profanityFilter', checked)}
                  description="Filter out profanity and inappropriate language"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age-appropriate content</label>
                <Select
                  options={[
                    { value: 'early_years', label: 'Early Years (3-5)' },
                    { value: 'primary', label: 'Primary (5-11)' },
                    { value: 'secondary', label: 'Secondary (11-16)' },
                    { value: 'sixth_form', label: 'Sixth Form (16-18)' },
                    { value: 'school', label: 'All School Ages' },
                    { value: 'adult', label: 'Adult (18+)' }
                  ]}
                  value={config.safetySettings.ageAppropriate}
                  onChange={(value) => handleNestedConfigChange('safetySettings', 'safetySettings', 'ageAppropriate', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Ensure content is appropriate for the selected age group</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Educational Compliance</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Curriculum Alignment</label>
                <Select
                  options={[
                    { value: 'uk_national', label: 'UK National Curriculum' },
                    { value: 'uk_eyfs', label: 'UK Early Years Foundation Stage' },
                    { value: 'uk_gcse', label: 'UK GCSE' },
                    { value: 'uk_a_level', label: 'UK A-Level' },
                    { value: 'international', label: 'International Curriculum' }
                  ]}
                  value={config.educationalSettings.curriculumAlignment}
                  onChange={(value) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'curriculumAlignment', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Align AI responses with the selected curriculum standards</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Target Age Group</label>
                <Select
                  options={[
                    { value: 'early_years', label: 'Early Years (3-5)' },
                    { value: 'ks1', label: 'Key Stage 1 (5-7)' },
                    { value: 'ks2', label: 'Key Stage 2 (7-11)' },
                    { value: 'ks3', label: 'Key Stage 3 (11-14)' },
                    { value: 'ks4', label: 'Key Stage 4 (14-16)' },
                    { value: 'ks5', label: 'Key Stage 5 (16-18)' },
                    { value: 'all', label: 'All Age Groups' }
                  ]}
                  value={config.educationalSettings.ageGroup}
                  onChange={(value) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'ageGroup', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Target age group for educational content</p>
              </div>
              
              <div>
                <Checkbox 
                  label="Enable difficulty adaptation"
                  checked={config.educationalSettings.difficultyAdaptation}
                  onChange={(checked) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'difficultyAdaptation', checked)}
                  description="Automatically adapt content difficulty based on user interactions"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Feedback Style</label>
                <Select
                  options={[
                    { value: 'constructive', label: 'Constructive' },
                    { value: 'encouraging', label: 'Encouraging' },
                    { value: 'direct', label: 'Direct' },
                    { value: 'socratic', label: 'Socratic (Question-based)' }
                  ]}
                  value={config.educationalSettings.feedbackStyle}
                  onChange={(value) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'feedbackStyle', value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Style of feedback provided in educational contexts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'providers',
      label: 'Provider Settings',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">OpenAI Configuration</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable OpenAI"
                  checked={config.providers.openai.enabled}
                  onChange={(checked) => handleNestedConfigChange('providers', 'openai', 'enabled', checked)}
                  description="Use OpenAI models for AI services"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Model</label>
                <Select
                  options={[
                    { value: 'gpt-4o', label: 'GPT-4o' },
                    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
                  ]}
                  value={config.providers.openai.defaultModel}
                  onChange={(value) => handleNestedConfigChange('providers', 'openai', 'defaultModel', value)}
                  className="w-full"
                  disabled={!config.providers.openai.enabled}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">API Status</label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">API key is valid and connection is working</p>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" disabled={!config.providers.openai.enabled}>
                  Test OpenAI Connection
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Anthropic Configuration</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable Anthropic"
                  checked={config.providers.anthropic.enabled}
                  onChange={(checked) => handleNestedConfigChange('providers', 'anthropic', 'enabled', checked)}
                  description="Use Anthropic Claude models for AI services"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Model</label>
                <Select
                  options={[
                    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
                    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
                    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' }
                  ]}
                  value={config.providers.anthropic.defaultModel}
                  onChange={(value) => handleNestedConfigChange('providers', 'anthropic', 'defaultModel', value)}
                  className="w-full"
                  disabled={!config.providers.anthropic.enabled}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">API Status</label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">API key is valid and connection is working</p>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" disabled={!config.providers.anthropic.enabled}>
                  Test Anthropic Connection
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Google Gemini</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Checkbox 
                    label="Enable Gemini"
                    checked={config.providers.gemini.enabled}
                    onChange={(checked) => handleNestedConfigChange('providers', 'gemini', 'enabled', checked)}
                    description="Use Google Gemini models"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Default Model</label>
                  <Select
                    options={[
                      { value: 'gemini-pro', label: 'Gemini Pro' },
                      { value: 'gemini-ultra', label: 'Gemini Ultra' }
                    ]}
                    value={config.providers.gemini.defaultModel}
                    onChange={(value) => handleNestedConfigChange('providers', 'gemini', 'defaultModel', value)}
                    className="w-full"
                    disabled={!config.providers.gemini.enabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">API Status</label>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">GROK</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Checkbox 
                    label="Enable GROK"
                    checked={config.providers.grok.enabled}
                    onChange={(checked) => handleNestedConfigChange('providers', 'grok', 'enabled', checked)}
                    description="Use GROK models"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Default Model</label>
                  <Select
                    options={[
                      { value: 'grok-1', label: 'Grok-1' }
                    ]}
                    value={config.providers.grok.defaultModel}
                    onChange={(value) => handleNestedConfigChange('providers', 'grok', 'defaultModel', value)}
                    className="w-full"
                    disabled={!config.providers.grok.enabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">API Status</label>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">OpenRouter</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Checkbox 
                    label="Enable OpenRouter"
                    checked={config.providers.openrouter.enabled}
                    onChange={(checked) => handleNestedConfigChange('providers', 'openrouter', 'enabled', checked)}
                    description="Use OpenRouter for model access"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Default Model</label>
                  <Select
                    options={[
                      { value: 'openai/gpt-4o', label: 'OpenAI GPT-4o' },
                      { value: 'anthropic/claude-3-opus', label: 'Anthropic Claude 3 Opus' },
                      { value: 'meta/llama-3', label: 'Meta Llama 3' }
                    ]}
                    value={config.providers.openrouter.defaultModel}
                    onChange={(value) => handleNestedConfigChange('providers', 'openrouter', 'defaultModel', value)}
                    className="w-full"
                    disabled={!config.providers.openrouter.enabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">API Status</label>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      label: 'Usage & Limits',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Rate Limiting</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">API Rate Limit (calls/minute)</label>
                <Input 
                  type="number"
                  value={config.usageSettings.rateLimit}
                  onChange={(e) => handleNestedConfigChange('usageSettings', 'usageSettings', 'rateLimit', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of API calls allowed per minute</p>
              </div>
              
              <div className="pt-2">
                <Checkbox 
                  label="Enable user quotas"
                  checked={config.usageSettings.userQuota.enabled}
                  onChange={(checked) => handleNestedConfigChange('usageSettings', 'userQuota', 'enabled', checked)}
                  description="Set usage limits per user"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Daily User Limit</label>
                <Input 
                  type="number"
                  value={config.usageSettings.userQuota.dailyLimit}
                  onChange={(e) => handleNestedConfigChange('usageSettings', 'userQuota', 'dailyLimit', parseInt(e.target.value))}
                  className="w-full"
                  disabled={!config.usageSettings.userQuota.enabled}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of AI requests per user per day</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Monthly User Limit</label>
                <Input 
                  type="number"
                  value={config.usageSettings.userQuota.monthlyLimit}
                  onChange={(e) => handleNestedConfigChange('usageSettings', 'userQuota', 'monthlyLimit', parseInt(e.target.value))}
                  className="w-full"
                  disabled={!config.usageSettings.userQuota.enabled}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of AI requests per user per month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Cost Management</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable cost management"
                  checked={config.usageSettings.costManagement.enabled}
                  onChange={(checked) => handleNestedConfigChange('usageSettings', 'costManagement', 'enabled', checked)}
                  description="Monitor and control AI service costs"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Budget Cap (£)</label>
                <Input 
                  type="number"
                  value={config.usageSettings.costManagement.budgetCap}
                  onChange={(e) => handleNestedConfigChange('usageSettings', 'costManagement', 'budgetCap', parseInt(e.target.value))}
                  className="w-full"
                  disabled={!config.usageSettings.costManagement.enabled}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum monthly spending on AI services</p>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Current Month Usage</label>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Used</span>
                      <span>£42.50 / £{config.usageSettings.costManagement.budgetCap}.00</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(42.5 / config.usageSettings.costManagement.budgetCap) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500">Total Requests</p>
                      <p className="text-sm font-medium">12,450</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500">Total Tokens</p>
                      <p className="text-sm font-medium">3.2M</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Usage Analytics</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">OpenAI Usage</h4>
                    <p className="text-2xl font-bold text-blue-600">56%</p>
                    <p className="text-xs text-gray-500 mt-1">7,012 requests</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Anthropic Usage</h4>
                    <p className="text-2xl font-bold text-purple-600">28%</p>
                    <p className="text-xs text-gray-500 mt-1">3,486 requests</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Other Providers</h4>
                    <p className="text-2xl font-bold text-green-600">16%</p>
                    <p className="text-xs text-gray-500 mt-1">1,952 requests</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">AI Configuration</h2>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600">Configuration saved</span>
          )}
          <Button 
            onClick={handleSaveConfig}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : 'Save Configuration'}
          </Button>
        </div>
      </div>
      
      <Tabs tabs={tabs} />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">API Key Management</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              API keys are securely stored in environment variables. To update API keys, please contact the system administrator.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
                <Input 
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Anthropic API Key</label>
                <Input 
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Google Gemini API Key</label>
                <Input 
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">GROK API Key</label>
                <Input 
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">OpenRouter API Key</label>
                <Input 
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
