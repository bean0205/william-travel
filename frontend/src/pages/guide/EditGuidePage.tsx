import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Upload, Card, message, Divider, Spin, Popconfirm } from 'antd';
import { UploadOutlined, SaveOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { getTourById, updateTour, deleteTour, Tour } from '@/services/api/tourService';

const { TextArea } = Input;
const { Option } = Select;

const EditGuidePage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form] = Form.useForm();
  const [tour, setTour] = useState<Tour | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTour = async () => {
      if (!guideId) return;
      
      try {
        setInitialLoading(true);
        const tourData = await getTourById(guideId);
        setTour(tourData);
        
        // Transform tour data to match form fields
        form.setFieldsValue({
          tourTitle: tourData.title,
          location: tourData.location,
          duration: tourData.duration,
          categories: tourData.categories,
          description: tourData.description,
          highlights: tourData.highlights,
          itinerary: tourData.itinerary,
          includedItems: tourData.includedItems,
          notIncludedItems: tourData.notIncludedItems,
          meetingPoint: tourData.meetingPoint,
          groupSize: tourData.groupSize?.toString(),
          price: tourData.price?.toString(),
        });
        
        setInitialLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching tour:', error);
        setError('Failed to load tour data. Please try again.');
        setInitialLoading(false);
      }
    };
    
    fetchTour();
  }, [guideId, form]);
  
  const onFinish = async (values: any) => {
    if (!guideId) return;
    
    try {
      setLoading(true);
      
      // Transform form values to match API expectations
      const tourData: Partial<Tour> = {
        title: values.tourTitle,
        description: values.description,
        location: values.location,
        duration: values.duration,
        price: parseFloat(values.price),
        categories: values.categories,
        highlights: values.highlights,
        itinerary: values.itinerary,
        includedItems: values.includedItems,
        notIncludedItems: values.notIncludedItems,
        meetingPoint: values.meetingPoint,
        groupSize: parseInt(values.groupSize, 10),
      };
      
      await updateTour(guideId, tourData);
      message.success('Tour updated successfully!');
      navigate('/guides/my-guides');
    } catch (error) {
      console.error('Error updating tour:', error);
      message.error('Failed to update tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!guideId) return;
    
    try {
      setLoading(true);
      await deleteTour(guideId);
      message.success('Tour deleted successfully!');
      navigate('/guides/my-guides');
    } catch (error) {
      console.error('Error deleting tour:', error);
      message.error('Failed to delete tour. Please try again.');
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <p>Loading tour information...</p>
      </div>
    );
  }
  
  return (
    <div className="edit-guide-page">
      <Typography.Title level={2}>Edit Tour</Typography.Title>
      <Typography.Paragraph>
        Make changes to your tour details below.
      </Typography.Paragraph>
      
      <Card style={{ marginBottom: '20px' }}>
        <Form
          form={form}
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
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              defaultFileList={[
                {
                  uid: '1',
                  name: 'tour-image-1.jpg',
                  status: 'done',
                  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                {
                  uid: '2',
                  name: 'tour-image-2.jpg',
                  status: 'done',
                  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
              ]}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading} size="large">
                Save Changes
              </Button>
              
              <Popconfirm
                title="Are you sure you want to delete this tour?"
                description="This action cannot be undone."
                onConfirm={handleDelete}
                okText="Yes, Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} size="large" loading={loading}>
                  Delete Tour
                </Button>
              </Popconfirm>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditGuidePage;
