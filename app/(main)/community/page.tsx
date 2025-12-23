const ComingSoon = ({ pageName }: { pageName: string }) => (
  <div className="w-full max-w-md p-6 bg-surface border-4 border-background rounded-lg text-center shadow-lg">
    <h1 className="font-press-start text-2xl text-primary mb-4">{pageName}</h1>
    <p className="font-vt323 text-xl text-text">Coming Soon!</p>
    <p className="font-vt323 text-lg text-text mt-4">This feature is under construction. Stay tuned, adventurer!</p>
  </div>
);

export default function CommunityPage() {
  return <ComingSoon pageName="Community" />;
}