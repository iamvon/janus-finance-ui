const OPTIONS = [
    {
        label: '24h',
        value: 't24h'
    },
    {
        label: '7d',
        value: 't7d'
    },
    {
        label: '30d',
        value: 't30d'
    },
    {
        label: 'all',
        value: 'tAll'
    },
]

const DateOption = ({selected, setSelected}) => {
    return (
        <div className={`bg-white flex flex-row shadow space-x-2 rounded-lg p-4 text-sm font-medium`}>
            {
                OPTIONS.map((option, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => setSelected(option.value)}
                            className={`${selected === option.value && 'bg-gray-100 text-blue-500'} p-2 uppercase cursor-pointer hover:bg-gray-100 rounded-lg`}
                        >
                            {option.label}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default DateOption