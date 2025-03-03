interface LoadingProps {
    isLoading: boolean
    borderColor: string,
    keyIndex: number,
}
export const Loading = ({ isLoading, borderColor, keyIndex}: LoadingProps) => {
    return (
        <div className="loading-box"
            key={`loading-container-${keyIndex}`}
            style={{
                display: isLoading ? 'flex' : 'none',
            }}>
            <span className="loading-spinner"
            key={`loading-container-spinner-${keyIndex}`}
                style={{
                    borderLeft: ` 5px solid ${borderColor}`,
                    borderBottom: ` 5px solid ${borderColor}`,
                    borderRight: ` 5px solid ${borderColor}`
                }} />
        </div>
    )
}