interface IModalSetDetails {
  album: { name: string; code: string };
  progression: {
    percent: number;
    acquired: number;
    total: number;
  };
}

export const StatsInfo = ({ album, progression }: IModalSetDetails) => {
  return (
    <div className="stats-container" key={`stats-container-${album.name}`}>
      <progress max={100} value={progression ? progression.percent : 0}>
        {progression ? progression.percent : 0}%
      </progress>
    </div>
  );
};
