const Error = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className='p-4 mb-4 text-red-800 bg-red-100 border border-red-400 rounded-lg font-bold'>
            {message}
        </div>
    )
}

export default Error