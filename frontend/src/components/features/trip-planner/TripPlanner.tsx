import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  MoveVertical,
  Wallet,
  Share2,
  Download,
  Edit,
  Save,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';

interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  description?: string;
  cost?: number;
  category: 'accommodation' | 'activity' | 'transportation' | 'food' | 'other';
}

interface TripPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget?: number;
  spentBudget?: number;
  items: ItineraryItem[];
}

// Mock data for demonstration
const mockTripPlan: TripPlan = {
  id: 'trip1',
  title: 'Khám phá Hà Nội',
  destination: 'Hà Nội, Việt Nam',
  startDate: '2025-06-01',
  endDate: '2025-06-05',
  totalBudget: 10000000, // VND
  spentBudget: 2500000, // VND
  items: [
    {
      id: 'item1',
      day: 1,
      time: '09:00',
      title: 'Tham quan Văn Miếu',
      location: 'Văn Miếu, Đống Đa',
      description: 'Tham quan di tích Văn Miếu - Quốc Tử Giám',
      cost: 30000,
      category: 'activity'
    },
    {
      id: 'item2',
      day: 1,
      time: '12:00',
      title: 'Ăn trưa Phở',
      location: 'Phở Thìn, Lò Đúc',
      cost: 60000,
      category: 'food'
    },
    {
      id: 'item3',
      day: 1,
      time: '14:00',
      title: 'Khám phá phố cổ',
      location: 'Hoàn Kiếm',
      description: 'Đi bộ khám phá các con phố cổ, mua sắm đồ lưu niệm',
      cost: 100000,
      category: 'activity'
    },
    {
      id: 'item4',
      day: 2,
      time: '08:00',
      title: 'Di chuyển đến Hạ Long',
      location: 'Quảng Ninh',
      description: 'Xe khách từ Hà Nội đi Hạ Long',
      cost: 250000,
      category: 'transportation'
    },
    {
      id: 'item5',
      day: 2,
      time: '12:00',
      title: 'Du thuyền Hạ Long',
      location: 'Vịnh Hạ Long',
      description: 'Tour du thuyền ngắm Vịnh Hạ Long',
      cost: 1200000,
      category: 'activity'
    }
  ]
};

export const TripPlanner = () => {
  const { t } = useTranslation(['common', 'itinerary']);
  const [tripPlan, setTripPlan] = useState<TripPlan>(mockTripPlan);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(tripPlan.title);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    day: 1,
    time: '',
    title: '',
    location: '',
    category: 'activity',
    cost: 0
  });

  // Calculate trip stats
  const totalDays = tripPlan.items.reduce((max, item) => Math.max(max, item.day), 0);
  const startDate = new Date(tripPlan.startDate);
  const endDate = new Date(tripPlan.endDate);
  const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Calculate costs
  const totalCost = tripPlan.items.reduce((sum, item) => sum + (item.cost || 0), 0);
  const remainingBudget = (tripPlan.totalBudget || 0) - totalCost;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Group items by day
  const itemsByDay = Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
    return {
      day,
      items: tripPlan.items
        .filter(item => item.day === day)
        .sort((a, b) => a.time.localeCompare(b.time))
    };
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Get days from the droppableId (format: "day-X")
    const sourceDay = parseInt(source.droppableId.split('-')[1]);
    const destDay = parseInt(destination.droppableId.split('-')[1]);

    // Copy items array
    const newItems = [...tripPlan.items];

    // Find the item being moved
    const sourceItems = newItems.filter(item => item.day === sourceDay);
    const [movedItem] = sourceItems.splice(source.index, 1);

    // Update day if moved to a different day
    if (sourceDay !== destDay) {
      movedItem.day = destDay;
    }

    // Remove the moved item from the array
    const itemIndex = newItems.findIndex(item => item.id === movedItem.id);
    if (itemIndex !== -1) {
      newItems.splice(itemIndex, 1);
    }

    // Insert the moved item at the destination
    const insertIndex = newItems.findIndex(item => item.day === destDay);
    newItems.splice(insertIndex !== -1 ? insertIndex + destination.index : 0, 0, movedItem);

    // Update state
    setTripPlan({
      ...tripPlan,
      items: newItems
    });
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.time) return;

    const item: ItineraryItem = {
      id: `item-${Date.now()}`,
      day: selectedDay,
      time: newItem.time || '',
      title: newItem.title || '',
      location: newItem.location || '',
      description: newItem.description,
      cost: newItem.cost || 0,
      category: newItem.category || 'activity'
    };

    setTripPlan({
      ...tripPlan,
      items: [...tripPlan.items, item]
    });

    // Reset form
    setNewItem({
      day: selectedDay,
      time: '',
      title: '',
      location: '',
      category: 'activity',
      cost: 0
    });
    setShowNewItemForm(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setTripPlan({
      ...tripPlan,
      items: tripPlan.items.filter(item => item.id !== itemId)
    });
  };

  const handleSaveTripTitle = () => {
    setTripPlan({
      ...tripPlan,
      title: editedTitle
    });
    setIsEditMode(false);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'accommodation': return '🏨';
      case 'activity': return '🎯';
      case 'transportation': return '🚗';
      case 'food': return '🍽️';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {isEditMode ? (
              <div className="flex gap-2 w-full">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="font-bold text-xl"
                />
                <Button size="sm" onClick={handleSaveTripTitle}>
                  <Save size={16} className="mr-2" />
                  {t('save')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CardTitle>{tripPlan.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  className="p-1 h-auto"
                >
                  <Edit size={14} />
                </Button>
              </div>
            )}
          </div>
          <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              {tripPlan.destination}
            </div>
            <div className="hidden sm:block text-muted-foreground">•</div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {new Date(tripPlan.startDate).toLocaleDateString('vi-VN')} - {new Date(tripPlan.endDate).toLocaleDateString('vi-VN')}
              <span className="ml-1 text-muted-foreground">({tripDuration} {t('days')})</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">{t('itinerary.totalBudget')}</div>
                <div className="text-xl font-bold">{formatCurrency(tripPlan.totalBudget || 0)}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">{t('itinerary.spent')}</div>
                <div className="text-xl font-bold">{formatCurrency(totalCost)}</div>
              </CardContent>
            </Card>
            <Card className={`${remainingBudget < 0 ? 'bg-destructive/10' : 'bg-muted/50'}`}>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">{t('itinerary.remaining')}</div>
                <div className={`text-xl font-bold ${remainingBudget < 0 ? 'text-destructive' : ''}`}>
                  {formatCurrency(remainingBudget)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('itinerary.schedule')}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 size={16} className="mr-2" />
                  {t('share')}
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  {t('export')}
                </Button>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              {itemsByDay.map(({ day, items }) => (
                <Card key={`day-${day}`} className="mb-4">
                  <CardHeader className="py-3">
                    <CardTitle className="text-md font-medium flex justify-between">
                      <div>
                        {t('itinerary.day')} {day}
                        <span className="text-sm text-muted-foreground ml-2">
                          {new Date(startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => {
                          setSelectedDay(day);
                          setShowNewItemForm(true);
                        }}
                      >
                        <Plus size={16} className="mr-1" />
                        {t('add')}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-1">
                    <Droppable droppableId={`day-${day}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 min-h-20 ${items.length === 0 ? 'border border-dashed rounded-md p-4 flex justify-center items-center' : ''}`}
                        >
                          {items.length === 0 ? (
                            <p className="text-muted-foreground text-center text-sm">
                              {t('itinerary.nothingPlanned')}
                            </p>
                          ) : (
                            items.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="border rounded-md p-3 bg-card flex gap-2"
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="flex items-center pr-2 text-muted-foreground"
                                    >
                                      <MoveVertical size={16} />
                                    </div>
                                    <div className="font-medium min-w-[60px]">
                                      {item.time}
                                    </div>
                                    <div className="flex-grow">
                                      <div className="font-medium">
                                        <span className="mr-2">{getCategoryIcon(item.category)}</span>
                                        {item.title}
                                      </div>
                                      {item.location && (
                                        <div className="text-sm text-muted-foreground flex items-center">
                                          <MapPin size={12} className="mr-1" />
                                          {item.location}
                                        </div>
                                      )}
                                      {item.description && (
                                        <div className="text-sm mt-1">{item.description}</div>
                                      )}
                                    </div>
                                    {item.cost > 0 && (
                                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatCurrency(item.cost)}
                                      </div>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-0 h-8 w-8 text-muted-foreground"
                                      onClick={() => handleDeleteItem(item.id)}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))}
            </DragDropContext>
          </div>

          {/* New item form */}
          {showNewItemForm && (
            <Card className="mt-4 border-primary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">{t('itinerary.addNewItem')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>{t('itinerary.day')}</Label>
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                    >
                      {Array.from({ length: tripDuration }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{t('itinerary.day')} {day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>{t('itinerary.time')}</Label>
                    <Input
                      type="time"
                      value={newItem.time}
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t('itinerary.category')}</Label>
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    >
                      <option value="activity">{t('itinerary.categoryActivity')}</option>
                      <option value="accommodation">{t('itinerary.categoryAccommodation')}</option>
                      <option value="transportation">{t('itinerary.categoryTransportation')}</option>
                      <option value="food">{t('itinerary.categoryFood')}</option>
                      <option value="other">{t('itinerary.categoryOther')}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>{t('itinerary.title')}</Label>
                  <Input
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder={t('itinerary.titlePlaceholder')}
                  />
                </div>

                <div className="mt-4">
                  <Label>{t('itinerary.location')}</Label>
                  <Input
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder={t('itinerary.locationPlaceholder')}
                  />
                </div>

                <div className="mt-4">
                  <Label>{t('itinerary.description')}</Label>
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder={t('itinerary.descriptionPlaceholder')}
                  />
                </div>

                <div className="mt-4">
                  <Label>{t('itinerary.cost')} (VNĐ)</Label>
                  <Input
                    type="number"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({ ...newItem, cost: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNewItemForm(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleAddItem}>
                  <Plus size={16} className="mr-2" />
                  {t('itinerary.addItem')}
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="flex items-center text-muted-foreground text-sm gap-1 mb-2">
            <Info size={14} />
            <span>{t('itinerary.dragTip')}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
