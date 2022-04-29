export interface Roles {
  member?: boolean;
  special?: boolean;
  admin?: boolean;
}

export interface User {
  uid: string;
  email?: string;
  photoURL?: string;
  displayName: string;
  roles?: Roles;
  contactNo?: string;
  fullName?: string;
  fatherName?: string;
  motherName?: string;
  nativePlace?: string;
  homeAddress?: string;
}
