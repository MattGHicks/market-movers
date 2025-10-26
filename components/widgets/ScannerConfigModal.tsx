'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TopListScannerSettings, TopListScannerSettingsSchema } from '@/types/widget.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScannerConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: TopListScannerSettings;
  onSave: (settings: TopListScannerSettings) => void;
}

export function ScannerConfigModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: ScannerConfigModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TopListScannerSettings>({
    resolver: zodResolver(TopListScannerSettingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: TopListScannerSettings) => {
    onSave(data);
    onOpenChange(false);
  };

  const sortBy = watch('sortBy');
  const sortOrder = watch('sortOrder');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scanner Configuration</DialogTitle>
          <DialogDescription>
            Configure filters and sorting for your stock scanner
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Price Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Price Filters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceMin">Min Price ($)</Label>
                <Input
                  id="priceMin"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('priceMin', { valueAsNumber: true })}
                />
                {errors.priceMin && (
                  <p className="text-xs text-destructive">{errors.priceMin.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceMax">Max Price ($)</Label>
                <Input
                  id="priceMax"
                  type="number"
                  step="0.01"
                  placeholder="No limit"
                  {...register('priceMax', { valueAsNumber: true })}
                />
                {errors.priceMax && (
                  <p className="text-xs text-destructive">{errors.priceMax.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Volume Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Volume Filters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volumeMin">Min Volume</Label>
                <Input
                  id="volumeMin"
                  type="number"
                  step="1"
                  placeholder="0"
                  {...register('volumeMin', { valueAsNumber: true })}
                />
                {errors.volumeMin && (
                  <p className="text-xs text-destructive">{errors.volumeMin.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="volumeMax">Max Volume</Label>
                <Input
                  id="volumeMax"
                  type="number"
                  step="1"
                  placeholder="No limit"
                  {...register('volumeMax', { valueAsNumber: true })}
                />
                {errors.volumeMax && (
                  <p className="text-xs text-destructive">{errors.volumeMax.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Change Percent Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Change % Filters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="changePercentMin">Min Change %</Label>
                <Input
                  id="changePercentMin"
                  type="number"
                  step="0.1"
                  placeholder="-100"
                  {...register('changePercentMin', { valueAsNumber: true })}
                />
                {errors.changePercentMin && (
                  <p className="text-xs text-destructive">{errors.changePercentMin.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="changePercentMax">Max Change %</Label>
                <Input
                  id="changePercentMax"
                  type="number"
                  step="0.1"
                  placeholder="100"
                  {...register('changePercentMax', { valueAsNumber: true })}
                />
                {errors.changePercentMax && (
                  <p className="text-xs text-destructive">{errors.changePercentMax.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Sorting</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setValue('sortBy', value as any)}
                >
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="symbol">Symbol</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="change">Change</SelectItem>
                    <SelectItem value="changePercent">Change %</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="marketCap">Market Cap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setValue('sortOrder', value as any)}
                >
                  <SelectTrigger id="sortOrder">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Display</h3>
            <div className="space-y-2">
              <Label htmlFor="maxItems">Max Items to Display</Label>
              <Input
                id="maxItems"
                type="number"
                step="1"
                min="1"
                max="1000"
                {...register('maxItems', { valueAsNumber: true })}
              />
              {errors.maxItems && (
                <p className="text-xs text-destructive">{errors.maxItems.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
