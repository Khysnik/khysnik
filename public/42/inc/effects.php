
<!--
svg filter experiments
/////////////////////////////////////////////////////////////////////////////
-->

<svg id="w93_effects" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>

    <filter id="ef_zombi_anim" x="0%" y="0%" width="100%" height="100%">
      <feFlood flood-color="#c3ff00" result="A" />
      <feColorMatrix type="matrix" in="SourceGraphic" result="B"
        values=" 1 0 0 0 0
                 0 0 0 0 0
                 0 1 1 0 0
                 1 1 1 0 0" />
      <feMerge>
        <feMergeNode in="A" />
        <feMergeNode in="B" />
      </feMerge>
      <feColorMatrix type='hueRotate' values='180'>
        <animate attributeName='values' attributeType='XML' begin='0s' dur='3s' repeatCount='indefinite' from='0' to='360'/>
      </feColorMatrix>
    </filter>

    <filter id='huerotate'>
      <feColorMatrix type='hueRotate' values='180'>
        <animate attributeName='values' attributeType='XML' begin='0s' dur='3s' repeatCount='indefinite' from='0' to='360'/>
      </feColorMatrix>
    </filter>

    <filter id="ef_zombi" x="0%" y="0%" width="100%" height="100%">
      <feFlood flood-color="#c3ff00" result="A" />
      <feColorMatrix type="matrix" in="SourceGraphic" result="B"
        values=" 1 0 0 0 0
                 0 0 0 0 0
                 0 1 1 0 0
                 1 1 1 0 0" />
      <feMerge>
        <feMergeNode in="A" />
        <feMergeNode in="B" />
      </feMerge>
    </filter>

    <filter id="ef_glitch">
      <feConvolveMatrix order="3" kernelMatrix="1 -1  1 -1 -0.01 -1 1 -1 1" edgeMode="duplicate" result="convo">
      </feConvolveMatrix>
    </filter>

    <filter id="ef_spectrum">
      <feConvolveMatrix filterRes="100 100" style="color-interpolation-filters:sRGB" order="3" kernelMatrix="0 -1 0   -1 4 -1   0 -1 0" preserveAlpha="true" />
    </filter>

    <filter id="ef_xray">
      <feColorMatrix type="luminanceToAlpha" values="1"/>
    </filter>

    <filter id="ef_emboss" >
      <feColorMatrix type="luminanceToAlpha" values=""/>
      <feDiffuseLighting diffuseConstant="1" surfaceScale="5" result="feDistantLight">
      <feDistantLight elevation="28" azimuth="65" /></feDiffuseLighting>
    </filter>

    <filter id="ef_edge">
      <!-- <feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="-5 0 0 0 0 0 0 0 5"/> -->
      <feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="-5 0 0 0 0 0 0 0 5"/>
    </filter>

    <filter id="noir">
      <feGaussianBlur stdDeviation="0" />
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0 .5 1 1" />
        <feFuncG type="discrete" tableValues="0 .5 1" />
        <feFuncB type="discrete" tableValues="0" />
      </feComponentTransfer>
    </filter>

<!--
 http://codepen.io/awgreenblatt/pen/Kdsfr
 -->

   <filter id="EmbossFilter" >
     <feConvolveMatrix order="5 5"
       preserveAlpha="true"
       kernelMatrix="-1 0 0 0 0 0 -2 0 0 0 0 0 3 0 0 0 0 0 0 0 0 0 0 0 0"/>
   </filter>

   <filter id="SharpenFilter">
     <feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"/>
   </filter>

   <filter id="EdgeDetectFilter">
     <feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="-5 0 0 0 0 0 0 0 5"/>
   </filter>

   <filter id="LuminanceMaskFilter">
     <feColorMatrix type="luminanceToAlpha"/>
   </filter>

   <filter id="GaussianBlurFilter">
     <feGaussianBlur stdDeviation="10 1"/>
   </filter>

   <filter id="GradientMapFilter">
    <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"> </feColorMatrix>
    <feComponentTransfer >
       <feFuncR type="table"
         tableValues="0 1 0 1"/>
       <feFuncG type="table"
         tableValues="0 0 0.4 1"/>
       <feFuncB type="table"
         tableValues="0 0 .4 1"/>
    </feComponentTransfer>
   </filter>

   <filter id="PosterizeFilter">
     <feComponentTransfer>
     <feFuncR type="discrete"
         tableValues="0 0.25 0.5 0.75 1"/>
     <feFuncG type="discrete"
         tableValues="0 0.25 0.5 0.75 1"/>
     <feFuncB type="discrete"
         tableValues="0 0.25 0.5 0.75 1"/>
   </feComponentTransfer>
   </filter>

   <filter id="GrayScaleFilter">
    <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0" />
   </filter>

   <filter id="XRayFilter">
    <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0" />
    <feComponentTransfer >
       <feFuncR type="table" tableValues="1 0"/>
       <feFuncG type="table" tableValues="1 0"/>
       <feFuncB type="table" tableValues="1 0"/>
    </feComponentTransfer>
   </filter>

   <filter id="WashoutFilter" filterUnits="objectBoundingBox"
             x="0%" y="0%" width="100%" height="100%">
     <feFlood flood-color="#ffffff" flood-opacity="0.5" result="flood"/>
     <feBlend mode="screen" in2="flood" in="SourceGraphic"/>
   </filter>


<!--
    <filter id="ef_turbulence">
      <feTurbulence baseFrequency=".01" type="fractalNoise" numOctaves="3" seed="23" stitchTiles="stitch" />
    </filter>

    <filter id="bluefill" x="0%" y="0%" width="100%" height="100%">
      <feFlood flood-color="#c3ff00" result="A" />
      <feColorMatrix type="matrix" in="SourceGraphic" result="B"
        values=" 1 0 0 0 0
                 0 1 0 0 0
                 0 0 1 0 0
                 1 1 1 0 0" />
      <feMerge>
        <feMergeNode in="A" />
        <feMergeNode in="B" />
      </feMerge>
    </filter>

    <filter id="displacement" x="0%" y="0%" height="100%" width="100%">
      <feDisplacementMap scale="100" in2="SourceGraphic" xChannelSelector="G" />
    </filter>
 -->

  </defs>
</svg>
