import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { WidgetConfig } from '@/types/widget.types';

interface WidgetState {
  widgets: {
    byId: Record<string, WidgetConfig>;
    allIds: string[];
  };
  addWidget: (widget: WidgetConfig) => void;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  removeWidget: (id: string) => void;
  clearWidgets: () => void;
  loadWidgets: (widgets: WidgetConfig[]) => void;
}

export const useWidgetStore = create<WidgetState>()(
  devtools(
    persist(
      (set) => ({
        widgets: { byId: {}, allIds: [] },

        addWidget: (widget) =>
          set((state) => ({
            widgets: {
              byId: { ...state.widgets.byId, [widget.id]: widget },
              allIds: [...state.widgets.allIds, widget.id],
            },
          })),

        updateWidget: (id, updates) =>
          set((state) => ({
            widgets: {
              ...state.widgets,
              byId: {
                ...state.widgets.byId,
                [id]: { ...state.widgets.byId[id], ...updates },
              },
            },
          })),

        removeWidget: (id) =>
          set((state) => {
            const { [id]: removed, ...rest } = state.widgets.byId;
            return {
              widgets: {
                byId: rest,
                allIds: state.widgets.allIds.filter((wid) => wid !== id),
              },
            };
          }),

        clearWidgets: () =>
          set({
            widgets: { byId: {}, allIds: [] },
          }),

        loadWidgets: (widgets) =>
          set({
            widgets: {
              byId: widgets.reduce(
                (acc, widget) => ({ ...acc, [widget.id]: widget }),
                {}
              ),
              allIds: widgets.map((w) => w.id),
            },
          }),
      }),
      {
        name: 'widget-storage',
      }
    )
  )
);
