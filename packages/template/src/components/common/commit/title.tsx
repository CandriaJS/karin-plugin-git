export const CommitTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-center items-center h-16">
      <span className="text-2xl font-bold">{title}</span>
    </div>
  )
}
