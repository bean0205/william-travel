import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const RatingsManagement = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Ratings Management</span>
          <Button onClick={() => navigate('/admin/ratings')}>Full Management View</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">All Ratings</div>
                <div className="text-sm text-muted-foreground">View and manage all user ratings</div>
                <Button
                  onClick={() => navigate('/admin/ratings')}
                  variant="outline" 
                  className="mt-4 w-full"
                >
                  View All
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">Flagged Ratings</div>
                <div className="text-sm text-muted-foreground">Review ratings that have been flagged</div>
                <Button
                  onClick={() => navigate('/admin/ratings?filter=flagged')}
                  variant="outline" 
                  className="mt-4 w-full"
                >
                  View Flagged
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">Pending Responses</div>
                <div className="text-sm text-muted-foreground">Reviews that need responses</div>
                <Button
                  onClick={() => navigate('/admin/ratings?filter=pending')}
                  variant="outline" 
                  className="mt-4 w-full"
                >
                  View Pending
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => navigate('/admin/ratings')}>
              Open Complete Rating Management
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingsManagement;
