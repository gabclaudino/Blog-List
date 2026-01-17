import { useState, forwardRef, useImperativeHandle } from 'react'


const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }


    useImperativeHandle(refs, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div className="w-full flex flex-col items-center">
            <div style={hideWhenVisible} className="w-full flex justify-center">
                <button
                    onClick={toggleVisibility}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transform active:scale-95 transition-all"
                >
                    + New Blog
                </button>
            </div>

            <div style={showWhenVisible} className="w-full animate-fade-in">
                <div className="flex flex-col items-center">
                    {props.children}

                    <button
                        onClick={toggleVisibility}
                        className="mt-4 text-gray-500 hover:text-gray-800 text-sm font-medium underline underline-offset-4 decoration-gray-300 hover:decoration-gray-600 transition-all"
                    >
                        Cancel and go back
                    </button>
                </div>
            </div>
        </div>
    )

})

export default Togglable