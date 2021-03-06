import {IBoardView, ITableView, ITimelineView, IViewFilter, TView, TViewQuery2, ViewAggregations, ViewSorts} from "@nishans/types";

export function initializeViewFilters (data: TView){
  if (!data.query2) data.query2 = { sort: [], aggregations: [], filter: { operator: "and", filters: [] } } as any;
  if (!data.query2?.filter) (data.query2 as TViewQuery2).filter = { operator: "and", filters: [] };
  if (!data.query2?.filter.filters) (data.query2 as TViewQuery2).filter.filters = [];
  return (data.query2 as any).filter as IViewFilter
}

export function initializeViewSorts (data: TView){
  if (!data.query2) data.query2 = { sort: [], aggregations: [] } as any;
  if (data.query2 && !data.query2?.sort) data.query2.sort = [];
  return (data.query2 as any).sort as ViewSorts[]
}

export function initializeViewAggregations(data: ITableView | IBoardView | ITimelineView){
  if (!data.query2) data.query2 = { sort: [], aggregations: [] } as any;
  if (data.query2 && !data.query2?.aggregations) data.query2.aggregations = [];
  return (data.query2 as any).aggregations as ViewAggregations[]
}