import Rainbow from '@indot/rainbowvis';

const decToHex = (dec) => {
    const decSafe = Math.max((Math.min(dec, 1)), 0);
    const decRounded = Math.round(decSafe*255);
    const hex = `${decSafe < 0.07 ? '0' : ''}${decRounded.toString(16).toUpperCase()}`;
    return hex;
}

const pickColor = (specLen, specId, opacity=1, customSpectrum=null) => {
    const colorSpectrum = customSpectrum ?? ['#315A5E', '#64A6A6', '#EBE782', '#EBAB69', '#ED6A5A'];
    const opacityHex = decToHex(opacity);

    if (specLen > colorSpectrum.length) {
        let myRainbow = new Rainbow();
        myRainbow.setSpectrum(...colorSpectrum);
        myRainbow.setNumberRange(0, specLen - 1);
    
        const color = `#${myRainbow.colourAt(specId)}${opacityHex}`;
        return color;
    } else {
        return `#${colorSpectrum[specId].slice(1)}${opacityHex}`;
    }
};

export default pickColor;