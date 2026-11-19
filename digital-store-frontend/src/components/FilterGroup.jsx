export default function FilterGroup({ title, options = [], inputType = 'checkbox', value = [], onChange }) {
  const selected = Array.isArray(value) ? value : [value]
  const toggle = (option) => {
    if (inputType === 'radio') return onChange(option)
    onChange(selected.includes(option) ? selected.filter(item => item !== option) : [...selected, option])
  }
  return <fieldset className="filter-group"><legend>{title}</legend>{options.map(option => <label key={option.value}>
    <input type={inputType} name={title} checked={selected.includes(option.value)} onChange={() => toggle(option.value)}/>
    <span>{option.text}</span>
  </label>)}</fieldset>
}