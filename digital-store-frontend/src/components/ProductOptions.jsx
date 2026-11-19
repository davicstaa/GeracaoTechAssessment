export default function ProductOptions({ options = [], shape = 'square', type = 'text', value, onChange }) {
  return <div className={`option-list ${shape}`}>
    {options.map(option => <button key={option} type="button" onClick={() => onChange(option)} className={value === option ? 'chosen' : ''} style={type === 'color' ? {backgroundColor: option} : {}} aria-label={type === 'color' ? `Cor ${option}` : `Opção ${option}`}>
      {type === 'text' ? option : <span className="sr-only">{option}</span>}
    </button>)}
  </div>
}