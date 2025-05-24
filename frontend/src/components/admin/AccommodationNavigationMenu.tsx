import React from 'react';
import { Button, Typography, Card } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';

const { Title } = Typography;

/**
 * AccommodationNavigationMenu component provides navigation buttons to accommodation management sections
 * This component can be reused across different accommodation management pages
 */
const AccommodationNavigationMenu: React.FC = () => {
  const navigate = useNavigate();

  // Navigation handler for accommodation management sections
  const navigateToSection = (path: string) => {
    navigate(path);
  };

  return (
    <Card style={{ marginBottom: 24 }}>
      <Title level={4}>Accommodation Management Sections</Title>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 16 }}>
        <PermissionGuard permission={Permission.CONTENT_VIEW}>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigateToSection('/admin/accommodations')}
            size="large"
          >
            Accommodations
          </Button>
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => navigateToSection('/admin/accommodations/categories')}
            size="large"
          >
            Accommodation Categories
          </Button>
        </PermissionGuard>
      </div>
    </Card>
  );
};

export default AccommodationNavigationMenu;
