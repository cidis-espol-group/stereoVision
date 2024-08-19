const Button = ({ label, onClick, className=''}) => {
    return (
        <button onClick={onClick} className={`mt-4 w-52 bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-[#4E99A8] hover:text-white hover:shadow-md ${className}`}>
          {label}
        </button>
    )
}

export default Button