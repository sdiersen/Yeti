export interface LinkType {
  name: string;
  uri: string;
}

export interface LinkGroupType {
  name: string;
  links: LinkType[];
}

export interface LeftSideBarProps {
  LinkTable: LinkGroupType[];
}
