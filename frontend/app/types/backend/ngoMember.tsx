export type NGOMember = {
  // ngoMember: {         Note: In Backend its with an ngoMemberWrapper
    userId: string,
    ngoId: string,
    isAdmin: boolean,
    isNGOUser: boolean,
    firstName: string,
    lastName: string,
    email: string,
    profilePictureLink: string | null,
    phoneNumber: string,
  // }
  
  ngoMemberHours: NGOMemberHours[]
}

export type NGOMemberHours = {
  startTime: string
  endTime: string
  weekday: string
}
