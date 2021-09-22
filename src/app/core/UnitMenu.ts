export interface UnitMenu {
  uuid: string;
  unitName: string;
  type: string;
  memo: string;
}
export interface UnitMenuGroup{
  uuid: string;
  icon: string;
  groupName: string;
  units: UnitMenu[];
}
export interface UnitResponse{
  public: UnitMenuGroup;
  user: UnitMenuGroup;
}
