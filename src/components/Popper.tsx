type PropsType = {
  children?: React.ReactNode;
};

export default function Popper({ children }: PropsType) {
  return <div>{children}</div>;
}
