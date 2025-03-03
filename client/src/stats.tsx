interface IModalSetDetails {
    album: { name: string, code: string }
    progression: {
        percent: number;
        acquired: number;
        total: number;
    }
}

export const StatsInfo = ({ album, progression }: IModalSetDetails) => {

    return (
        <div className="stats-container" key={`stats-container-${album.name}`}>
            <div className="stats-container-text"
                key={`status-text-${album.code}`}>
                <p className="stats-container-text-total"
                    key={`status-total-${album.code}`}>
                    {progression ? `${progression.acquired}/${progression.total}` : ""}
                </p>
                <p className="stats-container-text-percent"
                    key={`status-percent-${album.code}`}>
                    {progression ? progression.percent : 0}%
                </p>
            </div>

            <progress max={100} value={progression ? progression.percent : 0}>{progression ? progression.percent : 0}%</progress>
        </div>
    )
}