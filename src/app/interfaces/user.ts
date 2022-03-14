export interface Roles {
  member?: boolean;
  special?: boolean;
  admin?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  photoURL?: string | null;
  displayName?: string | null;
  roles?: Roles;
  contactNo?: string | null;
  fullName?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  nativePlace?: string | null;
  homeAddress?: string | null;
}
