interface LoadingProps {
    isLoading: boolean
    borderColor: string
}
export const Loading = ({ isLoading, borderColor}: LoadingProps) => {
    return (
        <div className="loading-box"
            style={{
                display: isLoading ? 'flex' : 'none',
            }}>
            <span className="loading-spinner"
                style={{
                    borderLeft: ` 5px solid ${borderColor}`,
                    borderBottom: ` 5px solid ${borderColor}`,
                    borderRight: ` 5px solid ${borderColor}`
                }} />
        </div>
    )
}