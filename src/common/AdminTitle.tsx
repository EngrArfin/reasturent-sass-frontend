interface IAdminTitleProp {
  title: string;
}

export default function AdminTitle({ title }: IAdminTitleProp) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-8 text-[#373A41]">{title}</h2>
    </div>
  );
}
