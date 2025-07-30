export type NgoMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  image?: string;
   ngo?: {
    id: string;
    name: string;
    country: string;
  };

  ngoMemberHours: CTHours[];
};

export type CTHours = {
  startTime: string; 
  endTime: string; 
  weekday: string; 
}
