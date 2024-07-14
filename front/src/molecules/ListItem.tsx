import { FC, PropsWithChildren } from "react";

interface ListItemProps {
  isError?: boolean;
}
const ListItem: FC<PropsWithChildren<ListItemProps>> = ({
  isError,
  children,
}) => (
  <li>
    <div
      className={`flex flex-row justify-between ${isError && "text-red-500"}`}
    >
      {children}
    </div>
  </li>
);

export default ListItem;
