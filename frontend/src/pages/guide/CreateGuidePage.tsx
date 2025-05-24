import React, { useState } from 'react';
import { Form, Input, Select, Button, Typography, Upload, Card, message, Divider } from 'antd';
import { UploadOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';

const { TextArea } = Input;
const { Option } = Select;

const CreateGuidePage: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const onFinish = (values: any) => {
    setLoading(true);
    console.log('Form values:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('Tour guide created successfully!');
      // In a real app, you would redirect to the new guide page
    }, 1500);
  };
  
  return (
    <div className="create-guide-page">
      <Typography.Title level={2}>Create New Tour</Typography.Title>
      <Typography.Paragraph>
        Share your local expertise and create a new tour experience for travelers.
      </Typography.Paragraph>
      
      <Card style={{ marginBottom: '20px' }}>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            guideId: user?.id,
            guideName: user?.full_name,
          }}
        >
          <Divider orientation="left">Basic Information</Divider>
          
          <Form.Item
            name="tourTitle"
            label="Tour Title"
            rules={[{ required: true, message: 'Please enter a tour title' }]}
          >
            <Input placeholder="E.g., Historic City Walking Tour" />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please select a location' }]}
          >
            <Select
              placeholder="Select a location"
              showSearch
              optionFilterProp="children"
            >
              <Option value="paris">Paris, France</Option>
              <Option value="london">London, UK</Option>
              <Option value="tokyo">Tokyo, Japan</Option>
              <Option value="nyc">New York City, USA</Option>
              <Option value="rome">Rome, Italy</Option>
              <Option value="barcelona">Barcelona, Spain</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="duration"
            label="Duration (hours)"
            rules={[{ required: true, message: 'Please enter the tour duration' }]}
          >
            <Select placeholder="Select duration">
              <Option value="1">1 hour</Option>
              <Option value="2">2 hours</Option>
              <Option value="3">3 hours</Option>
              <Option value="4">4 hours</Option>
              <Option value="5">5 hours</Option>
              <Option value="6">6 hours</Option>
              <Option value="8">8 hours (Full day)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="categories"
            label="Categories"
            rules={[{ required: true, message: 'Please select at least one category' }]}
          >
            <Select mode="multiple" placeholder="Select categories">
              <Option value="historical">Historical</Option>
              <Option value="cultural">Cultural</Option>
              <Option value="food">Food & Drink</Option>
              <Option value="nature">Nature</Option>
              <Option value="adventure">Adventure</Option>
              <Option value="art">Art & Museums</Option>
              <Option value="photography">Photography</Option>
            </Select>
          </Form.Item>
          
          <Divider orientation="left">Tour Details</Divider>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder="Describe your tour in detail..." />
          </Form.Item>
          
          <Form.Item
            name="highlights"
            label="Tour Highlights"
            rules={[{ required: true, message: 'Please enter tour highlights' }]}
          >
            <TextArea rows={3} placeholder="List the main highlights of your tour..." />
          </Form.Item>
          
          <Form.Item
            name="itinerary"
            label="Itinerary"
            rules={[{ required: true, message: 'Please enter the tour itinerary' }]}
          >
            <TextArea rows={5} placeholder="Outline the step-by-step itinerary of your tour..." />
          </Form.Item>
          
          <Form.Item
            name="includedItems"
            label="What's Included"
          >
            <TextArea rows={2} placeholder="What's included in the tour price? E.g., food samples, transportation..." />
          </Form.Item>
          
          <Form.Item
            name="notIncludedItems"
            label="What's Not Included"
          >
            <TextArea rows={2} placeholder="What's not included in the tour price? E.g., meals, entrance fees..." />
          </Form.Item>
          
          <Divider orientation="left">Logistics & Pricing</Divider>
          
          <Form.Item
            name="meetingPoint"
            label="Meeting Point"
            rules={[{ required: true, message: 'Please specify a meeting point' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="E.g., In front of the Eiffel Tower, South entrance" />
          </Form.Item>
          
          <Form.Item
            name="groupSize"
            label="Maximum Group Size"
            rules={[{ required: true, message: 'Please enter maximum group size' }]}
          >
            <Select placeholder="Select maximum group size">
              <Option value="1">1 person (Private)</Option>
              <Option value="2">2 people</Option>
              <Option value="5">5 people</Option>
              <Option value="10">10 people</Option>
              <Option value="15">15 people</Option>
              <Option value="20">20 people</Option>
              <Option value="25">25+ people</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Price per Person (USD)"
            rules={[{ required: true, message: 'Please enter the price per person' }]}
          >
            <Input type="number" placeholder="E.g., 25" prefix="$" />
          </Form.Item>
          
          <Form.Item
            name="photos"
            label="Tour Photos"
            rules={[{ required: true, message: 'Please upload at least one photo' }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Create Tour
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateGuidePage;
