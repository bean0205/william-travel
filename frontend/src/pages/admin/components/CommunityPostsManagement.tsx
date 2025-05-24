import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CommunityPostsManagement = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Community Posts Management</span>
          <Button onClick={() => navigate('/admin/community-posts')}>Full Management View</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">All Posts</div>
                <div className="text-sm text-muted-foreground">View and manage all community posts</div>
                <Button
                  onClick={() => navigate('/admin/community-posts')}
                  variant="outline" 
                  className="mt-4 w-full"
                >
                  View All
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">Flagged Posts</div>
                <div className="text-sm text-muted-foreground">Review posts that have been flagged</div>
                <Button
                  onClick={() => navigate('/admin/community-posts?filter=flagged')}
                  variant="outline" 
                  className="mt-4 w-full"
                >
                  View Flagged
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">Pending Posts</div>
                <div className="text-sm text-muted-foreground">Review posts awaiting approval</div>
                <Button
                  onClick={() => navigate('/admin/community-posts?filter=pending')}
                  variant="outline" 
                  className="mt-4 w-full"
                >
                  View Pending
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => navigate('/admin/community-posts')}>
              Open Complete Community Post Management
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPostsManagement;
