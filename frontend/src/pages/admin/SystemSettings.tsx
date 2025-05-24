import React, { useState, useEffect } from 'react';
import {
  getSystemSettings,
  updateSystemSettings,
  getApiKeys,
  updateApiKey,
  deleteApiKey,
  getFeatureToggles,
  updateFeatureToggle, 
  getCacheStats,
  enableCache,
  setCacheTTL,
  clearCache,
  type SystemSettings as SystemSettingsType,
  type ApiKey,
  type FeatureToggle,
  type CacheStats
} from '@/services/api/settingsService';
import { getSystemHealth } from '@/services/api/adminService';

const SystemSettings: React.FC = () => {
  // General settings state
  const [settings, setSettings] = useState<SystemSettingsType | null>(null);
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // API settings state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  // Feature toggles state
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([]);

  // Cache settings state
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [cacheEnabled, setCacheEnabled] = useState(false);
  const [cacheTTL, setCacheTTL] = useState(3600);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load all settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use Promise.all to fetch all data in parallel
        const [generalSettings, keys, toggles, stats, healthData] = await Promise.all([
          getSystemSettings(),
          getApiKeys(), 
          getFeatureToggles(),
          getCacheStats(),
          getSystemHealth() // New API call from adminService
        ]);
        
        // Set general settings
        setSettings(generalSettings);
        setSiteName(generalSettings.siteName);
        setSiteDescription(generalSettings.siteDescription);
        setSupportEmail(generalSettings.supportEmail);
        setContactPhone(generalSettings.contactPhone);
        setCacheEnabled(generalSettings.cacheEnabled);
        setCacheTTL(generalSettings.cacheTTL);
        
        // Set API keys
        setApiKeys(keys);
        
        // Set feature toggles
        setFeatureToggles(toggles);
        
        // Set cache stats
        setCacheStats(stats);
        
        // Log system health status
        console.log('System health status:', healthData);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Feature toggle handler
  const handleFeatureToggle = async (id: string) => {
    try {
      setSaving(true);
      // Find the current toggle to get its current state
      const toggle = featureToggles.find(t => t.id === id);
      if (!toggle) return;
      
      // Update the toggle in the backend
      await updateFeatureToggle(id, !toggle.enabled);
      
      // Update local state
      setFeatureToggles(features =>
        features.map(feature =>
          feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
        )
      );
      
      // Show success toast or message here
    } catch (err) {
      console.error('Failed to update feature toggle:', err);
      setError('Failed to update feature toggle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Save settings handler
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Save general settings
      await updateSystemSettings({
        id: settings?.id || '',
        siteName,
        siteDescription,
        supportEmail,
        contactPhone,
        cacheEnabled,
        cacheTTL,
        createdAt: settings?.createdAt,
        updatedAt: new Date().toISOString()
      });
      
      // Update cache settings on the server
      await enableCache(cacheEnabled);
      if (cacheEnabled) {
        await setCacheTTL(cacheTTL);
      }
      
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Clear cache handler
  const handleClearCache = async () => {
    try {
      const result = await clearCache();
      if (result.success) {
        alert(result.message || 'Cache cleared successfully!');
      } else {
        setError('Failed to clear cache. Please try again.');
      }
    } catch (err) {
      console.error('Failed to clear cache:', err);
      setError('Failed to clear cache. Please try again.');
    }
  };

  // Generate new API key handler
  const handleGenerateApiKey = async (id: string) => {
    try {
      // Find the current API key
      const apiKey = apiKeys.find(k => k.id === id);
      if (!apiKey) return;
      
      // Generate a new key on the server
      const newKey = 'new_' + Math.random().toString(36).substring(2, 15);
      
      // Update the API key
      await updateApiKey(id, {
        ...apiKey,
        key: newKey,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setApiKeys(keys =>
        keys.map(key =>
          key.id === id ? { ...key, key: newKey } : key
        )
      );
    } catch (err) {
      console.error('Failed to generate new API key:', err);
      setError('Failed to generate new API key. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">API Keys</h2>

          <table className="min-w-full mb-4">
            <thead>
              <tr>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id}>
                  <td className="py-2">{apiKey.service}</td>
                  <td className="py-2">
                    <span className="font-mono">{apiKey.key.substring(0, 4)}...{apiKey.key.substring(apiKey.key.length - 4)}</span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {apiKey.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      onClick={() => handleGenerateApiKey(apiKey.id)}
                      disabled={saving}
                    >
                      Generate New
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="px-4 py-2 bg-primary text-white rounded">
            Add New API Key
          </button>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Feature Toggles</h2>

          <ul className="space-y-3">
            {featureToggles.map((feature) => (
              <li key={feature.id} className="flex items-center justify-between">
                <span>{feature.feature}</span>
                <button
                  onClick={() => handleFeatureToggle(feature.id)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                    feature.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute transition-transform duration-200 ease-in-out h-5 w-5 bg-white rounded-full ${
                      feature.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cache Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Cache Settings</h2>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="cacheEnabled"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              checked={cacheEnabled}
              onChange={() => setCacheEnabled(!cacheEnabled)}
            />
            <label htmlFor="cacheEnabled" className="ml-2 block text-sm text-gray-700">
              Enable Caching
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cache TTL (seconds)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={cacheTTL}
              onChange={(e) => setCacheTTL(Number(e.target.value))}
              disabled={!cacheEnabled}
            />
          </div>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleClearCache}
          >
            Clear Cache
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded mr-4"
          onClick={() => window.location.reload()}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 bg-primary text-white rounded flex items-center justify-center"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
