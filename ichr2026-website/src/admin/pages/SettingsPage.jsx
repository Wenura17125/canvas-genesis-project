import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Save, Check } from 'lucide-react';

const SettingsPage = () => {
  const { get, post, loading, error } = useApi();
  const [settings, setSettings] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await get('/admin/settings');
        setSettings(response.data || {});
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };

    fetchSettings();
  }, [get]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await post('/admin/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  // Default values for settings that might not exist yet
  const getSettingValue = (key, defaultValue = '') => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  // Convert string "true"/"false" to boolean for switches
  const getBooleanValue = (key, defaultValue = false) => {
    const value = settings[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === true;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conference Settings</h1>
        <p className="text-muted-foreground">
          Manage conference settings and configurations
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Settings saved successfully
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general conference information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conference_name">Conference Name</Label>
                  <Input
                    id="conference_name"
                    value={getSettingValue('conference_name', 'ICHR 2026')}
                    onChange={(e) => handleSettingChange('conference_name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conference_tagline">Conference Tagline</Label>
                  <Input
                    id="conference_tagline"
                    value={getSettingValue('conference_tagline', 'International Conference on Human Rights 2026')}
                    onChange={(e) => handleSettingChange('conference_tagline', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conference_dates">Conference Dates</Label>
                  <Input
                    id="conference_dates"
                    value={getSettingValue('conference_dates', 'June 15-18, 2026')}
                    onChange={(e) => handleSettingChange('conference_dates', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conference_venue">Conference Venue</Label>
                  <Input
                    id="conference_venue"
                    value={getSettingValue('conference_venue', 'Colombo, Sri Lanka')}
                    onChange={(e) => handleSettingChange('conference_venue', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conference_description">Conference Description</Label>
                  <Textarea
                    id="conference_description"
                    value={getSettingValue('conference_description')}
                    onChange={(e) => handleSettingChange('conference_description', e.target.value)}
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conference_email">Contact Email</Label>
                  <Input
                    id="conference_email"
                    type="email"
                    value={getSettingValue('conference_email', 'contact@ichr2026.org')}
                    onChange={(e) => handleSettingChange('conference_email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conference_website">Website URL</Label>
                  <Input
                    id="conference_website"
                    type="url"
                    value={getSettingValue('conference_website', 'https://ichr2026.org')}
                    onChange={(e) => handleSettingChange('conference_website', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter/X URL</Label>
                  <Input
                    id="social_twitter"
                    value={getSettingValue('social_twitter')}
                    onChange={(e) => handleSettingChange('social_twitter', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook URL</Label>
                  <Input
                    id="social_facebook"
                    value={getSettingValue('social_facebook')}
                    onChange={(e) => handleSettingChange('social_facebook', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                  <Input
                    id="social_linkedin"
                    value={getSettingValue('social_linkedin')}
                    onChange={(e) => handleSettingChange('social_linkedin', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="ml-auto"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Registration Settings */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
              <CardDescription>
                Configure registration options and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registration_enabled">Enable Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to register for the conference
                  </p>
                </div>
                <Switch
                  id="registration_enabled"
                  checked={getBooleanValue('registration_enabled', true)}
                  onCheckedChange={(checked) => handleSettingChange('registration_enabled', checked.toString())}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Registration Dates</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="registration_start_date">Registration Start Date</Label>
                  <Input
                    id="registration_start_date"
                    type="date"
                    value={getSettingValue('registration_start_date')}
                    onChange={(e) => handleSettingChange('registration_start_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registration_end_date">Registration End Date</Label>
                  <Input
                    id="registration_end_date"
                    type="date"
                    value={getSettingValue('registration_end_date')}
                    onChange={(e) => handleSettingChange('registration_end_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="early_bird_end_date">Early Bird End Date</Label>
                  <Input
                    id="early_bird_end_date"
                    type="date"
                    value={getSettingValue('early_bird_end_date')}
                    onChange={(e) => handleSettingChange('early_bird_end_date', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Registration Pricing</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="price_presenting_regular">Presenting Author (Regular)</Label>
                  <Input
                    id="price_presenting_regular"
                    type="number"
                    value={getSettingValue('price_presenting_regular', '300')}
                    onChange={(e) => handleSettingChange('price_presenting_regular', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_presenting_early">Presenting Author (Early Bird)</Label>
                  <Input
                    id="price_presenting_early"
                    type="number"
                    value={getSettingValue('price_presenting_early', '250')}
                    onChange={(e) => handleSettingChange('price_presenting_early', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_non_presenting_regular">Non-Presenting (Regular)</Label>
                  <Input
                    id="price_non_presenting_regular"
                    type="number"
                    value={getSettingValue('price_non_presenting_regular', '250')}
                    onChange={(e) => handleSettingChange('price_non_presenting_regular', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_non_presenting_early">Non-Presenting (Early Bird)</Label>
                  <Input
                    id="price_non_presenting_early"
                    type="number"
                    value={getSettingValue('price_non_presenting_early', '200')}
                    onChange={(e) => handleSettingChange('price_non_presenting_early', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_student_regular">Student (Regular)</Label>
                  <Input
                    id="price_student_regular"
                    type="number"
                    value={getSettingValue('price_student_regular', '150')}
                    onChange={(e) => handleSettingChange('price_student_regular', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_student_early">Student (Early Bird)</Label>
                  <Input
                    id="price_student_early"
                    type="number"
                    value={getSettingValue('price_student_early', '120')}
                    onChange={(e) => handleSettingChange('price_student_early', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registration_instructions">Registration Instructions</Label>
                <Textarea
                  id="registration_instructions"
                  value={getSettingValue('registration_instructions')}
                  onChange={(e) => handleSettingChange('registration_instructions', e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="ml-auto"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Papers Settings */}
        <TabsContent value="papers">
          <Card>
            <CardHeader>
              <CardTitle>Paper Submission Settings</CardTitle>
              <CardDescription>
                Configure paper submission options and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="papers_enabled">Enable Paper Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to submit papers
                  </p>
                </div>
                <Switch
                  id="papers_enabled"
                  checked={getBooleanValue('papers_enabled', true)}
                  onCheckedChange={(checked) => handleSettingChange('papers_enabled', checked.toString())}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Submission Dates</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_submission_start">Submission Start Date</Label>
                  <Input
                    id="papers_submission_start"
                    type="date"
                    value={getSettingValue('papers_submission_start')}
                    onChange={(e) => handleSettingChange('papers_submission_start', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_submission_deadline">Submission Deadline</Label>
                  <Input
                    id="papers_submission_deadline"
                    type="date"
                    value={getSettingValue('papers_submission_deadline')}
                    onChange={(e) => handleSettingChange('papers_submission_deadline', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_notification_date">Notification Date</Label>
                  <Input
                    id="papers_notification_date"
                    type="date"
                    value={getSettingValue('papers_notification_date')}
                    onChange={(e) => handleSettingChange('papers_notification_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_camera_ready_deadline">Camera-Ready Deadline</Label>
                  <Input
                    id="papers_camera_ready_deadline"
                    type="date"
                    value={getSettingValue('papers_camera_ready_deadline')}
                    onChange={(e) => handleSettingChange('papers_camera_ready_deadline', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Submission Guidelines</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_max_pages">Maximum Pages</Label>
                  <Input
                    id="papers_max_pages"
                    type="number"
                    value={getSettingValue('papers_max_pages', '10')}
                    onChange={(e) => handleSettingChange('papers_max_pages', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_allowed_formats">Allowed File Formats</Label>
                  <Input
                    id="papers_allowed_formats"
                    value={getSettingValue('papers_allowed_formats', 'PDF, DOCX')}
                    onChange={(e) => handleSettingChange('papers_allowed_formats', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_template_url">Template URL</Label>
                  <Input
                    id="papers_template_url"
                    value={getSettingValue('papers_template_url')}
                    onChange={(e) => handleSettingChange('papers_template_url', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="papers_submission_guidelines">Submission Guidelines</Label>
                  <Textarea
                    id="papers_submission_guidelines"
                    value={getSettingValue('papers_submission_guidelines')}
                    onChange={(e) => handleSettingChange('papers_submission_guidelines', e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="ml-auto"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Settings</CardTitle>
              <CardDescription>
                Configure contact form and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="contact_form_enabled">Enable Contact Form</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to send messages through the contact form
                  </p>
                </div>
                <Switch
                  id="contact_form_enabled"
                  checked={getBooleanValue('contact_form_enabled', true)}
                  onCheckedChange={(checked) => handleSettingChange('contact_form_enabled', checked.toString())}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={getSettingValue('contact_email', 'contact@ichr2026.org')}
                  onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={getSettingValue('contact_phone')}
                  onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_address">Contact Address</Label>
                <Textarea
                  id="contact_address"
                  value={getSettingValue('contact_address')}
                  onChange={(e) => handleSettingChange('contact_address', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_form_instructions">Contact Form Instructions</Label>
                <Textarea
                  id="contact_form_instructions"
                  value={getSettingValue('contact_form_instructions')}
                  onChange={(e) => handleSettingChange('contact_form_instructions', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_auto_response">Auto-Response Message</Label>
                <Textarea
                  id="contact_auto_response"
                  value={getSettingValue('contact_auto_response', 'Thank you for contacting us. We will get back to you as soon as possible.')}
                  onChange={(e) => handleSettingChange('contact_auto_response', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="ml-auto"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;