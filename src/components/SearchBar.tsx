import styled from 'styled-components'

const Wrap = styled.div`
  display: grid;
  gap: .5rem;
`

const Input = styled.input`
  width: 100%;
  padding: .75rem 1rem;
  border-radius: 999px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.card};
  color: ${({theme}) => theme.colors.text};
`

export function SearchBar({ value, onChange, placeholder='Buscar posts...' }:
  { value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <Wrap>
      <label className="sr-only" htmlFor="search">Buscar</label>
      <Input id="search" type="search" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
    </Wrap>
  )
}
