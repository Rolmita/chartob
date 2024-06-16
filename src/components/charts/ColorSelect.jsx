
export default function ColorSelect({ onChange }) {
    return (
        <select name='backgroundColor' onChange={onChange}>
            <option value='#ffffff'>--Select a color--</option>
            <optgroup label='Yellows and oranges'>
                <option value='#d8c99b'>Sand</option>
                <option value='#fcec52'>Lemon yellow</option>
                <option value='#ebb93b'>Yellow egg</option>
                <option value='#f1a93c'>Pastel orange</option>
                <option value='#f0a202'>Orange</option>
                <option value='#d8973c'>Yellow Ochre</option>
                <option value='#f18805'>Dark orange</option>
                <option value='#fe8451'>Nectarine</option>
                <option value='#bd632f'>Orange bronze</option>
            </optgroup>
            <optgroup label='Reds and marrons'>
                <option value='#d95d39'>Red tomato</option>
                <option value='#d13030'>Red</option>
                <option value='#a4243b'>Burdeos</option>
                <option value='#581f18'>Maroon</option>
            </optgroup>
            <optgroup label='Greens'>
                <option value='#cfffb3'>Pastel mint</option>
                <option value='#ade25d'>Yellow green</option>
                <option value='#37a35d'>Green grass</option>
                <option value='#38a889'>Bluish green</option>
                <option value='#74b39c'>Pale bluish green</option>
                <option value='#3a5743'>Pine green</option>
                <option value='#0e2e2b'>Island green</option>
                <option value='#008000'>Green</option>
            </optgroup>
            <optgroup label='Blues'>
                <option value='#273e47'>Blue pond</option>
                <option value='#254656'>Twilight blue</option>
                <option value='#3b7080'>Cadet blue</option>
                <option value='#4D688F'>Distant blue</option>
                <option value='#202c59'>Midnight blue</option>
                <option value='#21294A'>Blue cobalt</option>
                <option value='#1baae2'>Light blue</option>
                {/* <option value='#edeff2'>Platinum silver</option> */}
            </optgroup>
        </select>
    )
}