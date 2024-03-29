export const formatField = (value: string) => {
  value = value?.trim();
  if (!value) return undefined;
  if (value === 'True') return true;
  if (value === 'False') return false;

  const num = Number(value);

  return isNaN(num) ? value : num;
};

// const formatRequriedKeys = [
//   'AssociationFee',
//   'BathroomsHalf',
//   'BathroomsTotal',
//   'BedroomsTotal',
//   'BuildingAreaTotal',
//   'FireplacesTotal',
//   // 'Latitude',
//   // 'Longitude',
//   'Lease',
//   'Levels',
//   'ListPrice',
//   'LotSizeArea',
//   'ParkingTotal',
//   'PhotosCount',
//   'YearBuilt',
//   'UnitNumber',
//   'Stories',
//   'GarageSpaces',
//   'RoomLength1',
//   'RoomLength2',
//   'RoomLength3',
//   'RoomLength4',
//   'RoomLength5',
//   'RoomLength6',
//   'RoomLength7',
//   'RoomLength8',
//   'RoomLength9',
//   'RoomLength10',
//   'RoomLength11',
//   'RoomLength12',
//   'RoomLength13',
//   'RoomLength14',
//   'RoomLength15',
//   'RoomLength16',
//   'RoomLength17',
//   'RoomLength18',
//   'RoomLength19',
//   'RoomLength20',
//   'RoomWidth1',
//   'RoomWidth2',
//   'RoomWidth3',
//   'RoomWidth4',
//   'RoomWidth5',
//   'RoomWidth6',
//   'RoomWidth7',
//   'RoomWidth8',
//   'RoomWidth9',
//   'RoomWidth10',
//   'RoomWidth11',
//   'RoomWidth12',
//   'RoomWidth13',
//   'RoomWidth14',
//   'RoomWidth15',
//   'RoomWidth16',
//   'RoomWidth17',
//   'RoomWidth18',
//   'RoomWidth19',
//   'RoomWidth20',

//   // bool type
//   'AttachedGarageYN',
//   'CarportYN',
//   'CoolingYN',
//   'GarageYN',
//   'OpenParkingYN',
//   'PoolYN',
//   'ViewYN',
//   'WaterfrontYN',
//   'CoListAgentEmail',
//   'ListAgentEmail',
// ];
