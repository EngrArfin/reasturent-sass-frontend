interface IAdminTitleProp {
  title: string;
}

export default function AdminTitle({ title }: IAdminTitleProp) {
  return (
    <div className="text-center">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-8 text-white">
        {title}
      </h2>
    </div>
  );
}
