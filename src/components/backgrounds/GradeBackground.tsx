import React, { useEffect, useState } from 'react';
import { GradeKey } from '../../types';

interface BGProps { opacity: number; }

// Kindergarten — balloons, stars, crayons
const KinderBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    {/* Balloons */}
    <ellipse cx="80" cy="120" rx="28" ry="36" fill="#FF6B6B" opacity="0.35"/>
    <line x1="80" y1="156" x2="80" y2="190" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.35"/>
    <ellipse cx="140" cy="80" rx="24" ry="32" fill="#FFD93D" opacity="0.3"/>
    <line x1="140" y1="112" x2="138" y2="148" stroke="#FFD93D" strokeWidth="1.5" opacity="0.3"/>
    <ellipse cx="700" cy="100" rx="26" ry="34" fill="#6BCB77" opacity="0.3"/>
    <line x1="700" y1="134" x2="702" y2="170" stroke="#6BCB77" strokeWidth="1.5" opacity="0.3"/>
    <ellipse cx="760" cy="150" rx="22" ry="30" fill="#4D96FF" opacity="0.3"/>
    <line x1="760" y1="180" x2="758" y2="210" stroke="#4D96FF" strokeWidth="1.5" opacity="0.3"/>
    {/* Stars */}
    {[[200,50],[400,30],[600,60],[150,300],[650,280],[350,500],[100,480],[700,450]].map(([x,y],i) => (
      <text key={i} x={x} y={y} fontSize={i%2===0?20:14} fill="#FFD93D" opacity="0.25" textAnchor="middle">★</text>
    ))}
    {/* Crayons */}
    <g transform="translate(30,400) rotate(-20)" opacity="0.2">
      <rect x="0" y="0" width="12" height="50" rx="3" fill="#FF6B6B"/>
      <polygon points="0,50 12,50 6,65" fill="#cc4444"/>
      <rect x="0" y="0" width="12" height="10" rx="2" fill="#e0e0e0"/>
    </g>
    <g transform="translate(740,380) rotate(15)" opacity="0.2">
      <rect x="0" y="0" width="12" height="50" rx="3" fill="#4D96FF"/>
      <polygon points="0,50 12,50 6,65" fill="#2255cc"/>
      <rect x="0" y="0" width="12" height="10" rx="2" fill="#e0e0e0"/>
    </g>
    {/* ABC letters scattered */}
    {[['A',60,550],['B',720,520],['C',380,570]].map(([l,x,y]) => (
      <text key={String(l)} x={Number(x)} y={Number(y)} fontSize="28" fontWeight="bold" fill="#7c5cbf" opacity="0.12" fontFamily="Fredoka One, cursive">{l}</text>
    ))}
  </svg>
);

// 1st Grade — butterflies, flowers, rainbow
const FirstBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Rainbow arc — properly rounded using circle arcs */}
    <path d="M 50 600 A 360 360 0 0 1 750 600" stroke="#FF6B6B" strokeWidth="10" fill="none" opacity="0.13"/>
    <path d="M 75 600 A 335 335 0 0 1 725 600" stroke="#FF9F43" strokeWidth="10" fill="none" opacity="0.13"/>
    <path d="M 100 600 A 310 310 0 0 1 700 600" stroke="#FFD93D" strokeWidth="10" fill="none" opacity="0.13"/>
    <path d="M 125 600 A 285 285 0 0 1 675 600" stroke="#6BCB77" strokeWidth="10" fill="none" opacity="0.13"/>
    <path d="M 150 600 A 260 260 0 0 1 650 600" stroke="#4D96FF" strokeWidth="10" fill="none" opacity="0.13"/>
    <path d="M 175 600 A 235 235 0 0 1 625 600" stroke="#7c5cbf" strokeWidth="10" fill="none" opacity="0.13"/>
    {/* Flowers */}
    {[[80,450],[720,430],[400,530],[200,500],[600,510]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.2">
        {[0,60,120,180,240,300].map(a => (
          <ellipse key={a} cx={Math.cos(a*Math.PI/180)*12} cy={Math.sin(a*Math.PI/180)*12} rx="7" ry="5" fill={['#FF6B6B','#FFD93D','#FF9F43','#FF6B6B','#6BCB77','#4D96FF'][i%6]} transform={`rotate(${a})`}/>
        ))}
        <circle cx="0" cy="0" r="6" fill="#FFD93D"/>
      </g>
    ))}
    {/* Butterfly */}
    <g transform="translate(650,80)" opacity="0.2">
      <ellipse cx="-18" cy="-8" rx="18" ry="12" fill="#FF6B6B" transform="rotate(-20)"/>
      <ellipse cx="18" cy="-8" rx="18" ry="12" fill="#FF9F43" transform="rotate(20)"/>
      <ellipse cx="-12" cy="8" rx="12" ry="8" fill="#FFD93D" transform="rotate(10)"/>
      <ellipse cx="12" cy="8" rx="12" ry="8" fill="#6BCB77" transform="rotate(-10)"/>
      <ellipse cx="0" cy="0" rx="4" ry="10" fill="#333"/>
    </g>
    <g transform="translate(100,100)" opacity="0.18">
      <ellipse cx="-15" cy="-6" rx="15" ry="10" fill="#4D96FF" transform="rotate(-20)"/>
      <ellipse cx="15" cy="-6" rx="15" ry="10" fill="#7c5cbf" transform="rotate(20)"/>
      <ellipse cx="-10" cy="6" rx="10" ry="7" fill="#FF6B6B" transform="rotate(10)"/>
      <ellipse cx="10" cy="6" rx="10" ry="7" fill="#FF9F43" transform="rotate(-10)"/>
      <ellipse cx="0" cy="0" rx="3" ry="8" fill="#333"/>
    </g>
  </svg>
);

// 2nd Grade — rockets and planets
const SecondBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Stars */}
    {[[50,80],[150,40],[300,70],[500,30],[650,60],[750,100],[100,200],[700,180],[400,150],[200,300],[600,280],[80,400],[720,380],[350,480],[150,520],[650,500]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i%3===0?2:1.5} fill="white" opacity="0.3"/>
    ))}
    {/* Planet 1 */}
    <circle cx="680" cy="120" r="55" fill="#4D96FF" opacity="0.15"/>
    <ellipse cx="680" cy="120" rx="80" ry="18" fill="none" stroke="#4D96FF" strokeWidth="4" opacity="0.15"/>
    {/* Planet 2 small */}
    <circle cx="100" cy="480" r="35" fill="#FF9F43" opacity="0.15"/>
    <ellipse cx="100" cy="480" rx="50" ry="12" fill="none" stroke="#FF9F43" strokeWidth="3" opacity="0.15"/>
    {/* Rocket */}
    <g transform="translate(720,380) rotate(-30)" opacity="0.2">
      <polygon points="0,-30 12,10 -12,10" fill="#e0e0e0"/>
      <rect x="-10" y="10" width="20" height="30" rx="3" fill="#4D96FF"/>
      <polygon points="-10,40 -18,55 -2,40" fill="#FF6B6B"/>
      <polygon points="10,40 18,55 2,40" fill="#FF6B6B"/>
      <circle cx="0" cy="18" r="6" fill="#FFD93D"/>
    </g>
    <g transform="translate(60,100) rotate(15)" opacity="0.18">
      <polygon points="0,-24 10,8 -10,8" fill="#e0e0e0"/>
      <rect x="-8" y="8" width="16" height="24" rx="3" fill="#FF6B6B"/>
      <polygon points="-8,32 -14,44 -2,32" fill="#FFD93D"/>
      <polygon points="8,32 14,44 2,32" fill="#FFD93D"/>
      <circle cx="0" cy="15" r="5" fill="#4D96FF"/>
    </g>
  </svg>
);

// 3rd Grade — jungle animals
const ThirdBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Trees */}
    {[[60,600],[160,600],[680,600],[740,600]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.18">
        <rect x="-6" y="-80" width="12" height="80" fill="#8B6914"/>
        <ellipse cx="0" cy="-90" rx="35" ry="45" fill="#2d8a4e"/>
        <ellipse cx="-18" cy="-70" rx="22" ry="28" fill="#3aad62"/>
        <ellipse cx="18" cy="-65" rx="22" ry="28" fill="#3aad62"/>
      </g>
    ))}
    {/* Leaves scattered */}
    {[[200,50],[400,40],[600,55],[150,150],[650,130],[350,520],[100,530],[700,510]].map(([x,y],i) => (
      <ellipse key={i} cx={x} cy={y} rx="14" ry="8" fill="#2d8a4e" opacity="0.15" transform={`rotate(${i*30})`}/>
    ))}
    {/* Simple monkey face */}
    <g transform="translate(720,200)" opacity="0.18">
      <circle cx="0" cy="0" r="28" fill="#c8874a"/>
      <ellipse cx="0" cy="12" rx="16" ry="12" fill="#e8b88a"/>
      <circle cx="-10" cy="-6" r="5" fill="white"/>
      <circle cx="10" cy="-6" r="5" fill="white"/>
      <circle cx="-9" cy="-5" r="3" fill="#333"/>
      <circle cx="11" cy="-5" r="3" fill="#333"/>
      <circle cx="-28" cy="-10" r="10" fill="#c8874a"/>
      <circle cx="28" cy="-10" r="10" fill="#c8874a"/>
    </g>
    {/* Parrot */}
    <g transform="translate(60,200)" opacity="0.18">
      <ellipse cx="0" cy="0" rx="18" ry="22" fill="#FF6B6B"/>
      <ellipse cx="0" cy="-18" rx="12" ry="14" fill="#6BCB77"/>
      <polygon points="-6,10 6,10 0,22" fill="#FFD93D"/>
      <circle cx="-5" cy="-20" r="3" fill="black"/>
    </g>
  </svg>
);

// 4th Grade — ocean
const FourthBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Waves */}
    <path d="M0 480 Q100 460 200 480 Q300 500 400 480 Q500 460 600 480 Q700 500 800 480 L800 600 L0 600Z" fill="#4D96FF" opacity="0.1"/>
    <path d="M0 510 Q120 490 240 510 Q360 530 480 510 Q600 490 800 510 L800 600 L0 600Z" fill="#4D96FF" opacity="0.12"/>
    {/* Fish */}
    {[[150,420],[500,400],[680,440],[300,460],[600,470]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.2">
        <ellipse cx="0" cy="0" rx="20" ry="10" fill={['#FF6B6B','#4D96FF','#FFD93D','#6BCB77','#FF9F43'][i]}/>
        <polygon points="20,0 30,-8 30,8" fill={['#FF6B6B','#4D96FF','#FFD93D','#6BCB77','#FF9F43'][i]}/>
        <circle cx="-10" cy="-3" r="3" fill="white"/>
        <circle cx="-9" cy="-3" r="1.5" fill="black"/>
      </g>
    ))}
    {/* Starfish */}
    <g transform="translate(80,530)" opacity="0.18">
      {[0,72,144,216,288].map(a => (
        <ellipse key={a} cx={Math.cos((a-90)*Math.PI/180)*18} cy={Math.sin((a-90)*Math.PI/180)*18} rx="6" ry="14" fill="#FF9F43" transform={`rotate(${a},${Math.cos((a-90)*Math.PI/180)*18},${Math.sin((a-90)*Math.PI/180)*18})`}/>
      ))}
      <circle cx="0" cy="0" r="8" fill="#FF9F43"/>
    </g>
    {/* Whale */}
    <g transform="translate(640,100)" opacity="0.15">
      <ellipse cx="0" cy="0" rx="55" ry="28" fill="#4D96FF"/>
      <circle cx="-35" cy="-5" r="18" fill="#4D96FF"/>
      <polygon points="50,-5 70,-20 70,10" fill="#4D96FF"/>
      <circle cx="-42" cy="-8" r="4" fill="white"/>
      <circle cx="-40" cy="-7" r="2" fill="#333"/>
      <path d="M-20,15 Q0,28 20,15" stroke="white" strokeWidth="2" fill="none" opacity="0.5"/>
    </g>
  </svg>
);

// 5th Grade — mountains and adventure
const FifthBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    <polygon points="0,600 150,300 300,600" fill="#7c5cbf" opacity="0.1"/>
    <polygon points="100,600 300,200 500,600" fill="#5a4291" opacity="0.1"/>
    <polygon points="300,600 500,250 700,600" fill="#7c5cbf" opacity="0.1"/>
    <polygon points="500,600 650,320 800,600" fill="#5a4291" opacity="0.08"/>
    <polygon points="280,220 300,200 320,220" fill="white" opacity="0.2"/>
    <polygon points="480,270 500,250 520,270" fill="white" opacity="0.2"/>
    {[[200,80],[400,50],[600,70],[100,150],[700,130]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i%2===0?2:1.5} fill="white" opacity="0.25"/>
    ))}
    <path d="M0,560 Q200,540 400,555 Q600,570 800,550" stroke="#6BCB77" strokeWidth="3" fill="none" opacity="0.2"/>
    <g transform="translate(720,450)" opacity="0.2">
      <polygon points="0,-40 8,0 -8,0" fill="#FF9F43"/>
      <rect x="-12" y="0" width="24" height="30" rx="2" fill="#c8874a"/>
      <rect x="-6" y="-8" width="12" height="8" fill="#FFD93D"/>
    </g>
  </svg>
);

// 6th Grade — city skyline
const SixthBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {[
      [0,600,60,180],[60,600,40,220],[100,600,80,160],[180,600,50,200],[230,600,70,250],
      [300,600,90,180],[390,600,55,220],[445,600,75,190],[520,600,60,240],[580,600,85,170],
      [665,600,50,200],[715,600,65,180],[780,600,40,210]
    ].map(([x,h,w,height],i) => (
      <g key={i} opacity="0.12">
        <rect x={x} y={Number(h)-Number(height)} width={w} height={height} fill="#7c5cbf"/>
        {Array.from({length:Math.floor(Number(height)/25)}).map((_,r) =>
          Array.from({length:Math.floor(Number(w)/20)}).map((_,c) => (
            <rect key={`${r}-${c}`} x={Number(x)+c*20+5} y={Number(h)-Number(height)+r*25+8} width="8" height="10" fill="#FFD93D" opacity="0.6"/>
          ))
        )}
      </g>
    ))}
    <circle cx="400" cy="80" r="40" fill="#FFD93D" opacity="0.12"/>
    {[30,60,90,120,150].map(a => (
      <line key={a} x1="400" y1="80" x2={400+Math.cos(a*Math.PI/180)*65} y2={80+Math.sin(a*Math.PI/180)*65} stroke="#FFD93D" strokeWidth="2" opacity="0.1"/>
    ))}
  </svg>
);

// 7th Grade — music and art
const SeventhBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Music notes */}
    {[[80,120],[200,80],[400,100],[600,90],[720,130],[150,350],[650,330],[350,450],[100,480],[700,460]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.18">
        <ellipse cx="0" cy="0" rx="8" ry="6" fill="#7c5cbf" transform="rotate(-20)"/>
        <line x1="8" y1="-2" x2="8" y2="-28" stroke="#7c5cbf" strokeWidth="2"/>
        {i%2===0 && <line x1="8" y1="-28" x2="20" y2="-24" stroke="#7c5cbf" strokeWidth="2"/>}
      </g>
    ))}
    {/* Paint palette */}
    <g transform="translate(700,400)" opacity="0.18">
      <ellipse cx="0" cy="0" rx="40" ry="35" fill="#e0d0ff"/>
      <ellipse cx="15" cy="15" rx="8" ry="8" fill="white"/>
      {[[-20,-10],[0,-22],[20,-15],[-15,10]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="7" fill={['#FF6B6B','#FFD93D','#4D96FF','#6BCB77'][i]}/>
      ))}
    </g>
    {/* Treble clef simplified */}
    <g transform="translate(80,350)" opacity="0.15">
      <path d="M0,0 Q20,-60 0,-80 Q-20,-60 0,-40 Q20,-20 0,0 Q-10,20 0,40" stroke="#7c5cbf" strokeWidth="3" fill="none"/>
    </g>
    {/* Color swirls */}
    {['#FF6B6B','#FFD93D','#4D96FF','#6BCB77'].map((c,i) => (
      <path key={i} d={`M${100+i*160},${500+i*10} Q${130+i*160},${470+i*10} ${160+i*160},${500+i*10}`} stroke={c} strokeWidth="3" fill="none" opacity="0.2"/>
    ))}
  </svg>
);

// 8th Grade — science lab
const EighthBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Flask */}
    <g transform="translate(680,350)" opacity="0.18">
      <path d="M-15,-60 L-15,0 L-35,50 L35,50 L15,0 L15,-60Z" fill="none" stroke="#4D96FF" strokeWidth="3"/>
      <path d="M-35,50 L35,50 L15,0 L-15,0Z" fill="#4D96FF" opacity="0.3"/>
      <rect x="-18" y="-65" width="36" height="8" rx="2" fill="#4D96FF" opacity="0.5"/>
      <circle cx="-10" cy="20" r="5" fill="#4D96FF" opacity="0.4"/>
      <circle cx="10" cy="30" r="3" fill="#4D96FF" opacity="0.4"/>
    </g>
    {/* Atom */}
    <g transform="translate(100,200)" opacity="0.15">
      <circle cx="0" cy="0" r="10" fill="#FFD93D"/>
      <ellipse cx="0" cy="0" rx="45" ry="18" fill="none" stroke="#4D96FF" strokeWidth="2"/>
      <ellipse cx="0" cy="0" rx="45" ry="18" fill="none" stroke="#4D96FF" strokeWidth="2" transform="rotate(60)"/>
      <ellipse cx="0" cy="0" rx="45" ry="18" fill="none" stroke="#4D96FF" strokeWidth="2" transform="rotate(120)"/>
    </g>
    {/* DNA helix simplified */}
    {Array.from({length:8}).map((_,i) => (
      <g key={i} opacity="0.15">
        <circle cx={700} cy={80+i*50} r="5" fill="#6BCB77"/>
        <circle cx={740} cy={105+i*50} r="5" fill="#FF6B6B"/>
        <line x1={700} y1={80+i*50} x2={740} y2={105+i*50} stroke="#ccc" strokeWidth="1.5"/>
      </g>
    ))}
    {/* Microscope simplified */}
    <g transform="translate(80,450)" opacity="0.18">
      <rect x="-5" y="-60" width="10" height="60" fill="#888"/>
      <circle cx="0" cy="-60" r="14" fill="none" stroke="#888" strokeWidth="3"/>
      <rect x="-20" y="0" width="40" height="8" rx="3" fill="#888"/>
      <rect x="-6" y="-30" width="12" height="10" fill="#4D96FF" opacity="0.5"/>
    </g>
    {/* Bubbles */}
    {[[350,100],[400,150],[500,80],[600,120]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={6+i*2} fill="none" stroke="#4D96FF" strokeWidth="1.5" opacity="0.15"/>
    ))}
  </svg>
);

// 9th Grade — books and literature
const NinthBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Stack of books */}
    <g transform="translate(680,430)" opacity="0.2">
      {[['#FF6B6B',0],['#4D96FF',14],['#FFD93D',28],['#6BCB77',42]].map(([c,y]) => (
        <rect key={String(y)} x="-40" y={Number(y)-80} width="80" height="12" rx="2" fill={String(c)}/>
      ))}
    </g>
    <g transform="translate(80,420)" opacity="0.2">
      {[['#7c5cbf',0],['#FF9F43',14],['#4D96FF',28]].map(([c,y]) => (
        <rect key={String(y)} x="-35" y={Number(y)-60} width="70" height="12" rx="2" fill={String(c)}/>
      ))}
    </g>
    {/* Open book */}
    <g transform="translate(400,500)" opacity="0.15">
      <path d="M0,-20 Q-60,-30 -80,-20 L-80,30 Q-60,20 0,20Z" fill="#e0d0ff"/>
      <path d="M0,-20 Q60,-30 80,-20 L80,30 Q60,20 0,20Z" fill="#d0e8ff"/>
      <line x1="0" y1="-20" x2="0" y2="20" stroke="#888" strokeWidth="2"/>
      {[-50,-30,-10].map(x => <line key={x} x1={x} y1="-5" x2={x+20} y2="-5" stroke="#aaa" strokeWidth="1"/>)}
      {[10,30,50].map(x => <line key={x} x1={x} y1="-5" x2={x+20} y2="-5" stroke="#aaa" strokeWidth="1"/>)}
    </g>
    {/* Quill pen */}
    <g transform="translate(720,150) rotate(-30)" opacity="0.18">
      <path d="M0,0 Q-10,-40 0,-80 Q10,-60 5,-20 Q2,-10 0,0Z" fill="#e8d090"/>
      <line x1="0" y1="0" x2="0" y2="20" stroke="#333" strokeWidth="1.5"/>
    </g>
    {/* Ink dots */}
    {[[100,100],[200,80],[600,90],[700,70]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={3} fill="#7c5cbf" opacity="0.15"/>
    ))}
  </svg>
);

// 10th Grade — world map / globe
const TenthBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Globe */}
    <circle cx="400" cy="300" r="200" fill="none" stroke="#4D96FF" strokeWidth="1.5" opacity="0.1"/>
    <ellipse cx="400" cy="300" rx="200" ry="60" fill="none" stroke="#4D96FF" strokeWidth="1" opacity="0.08"/>
    <ellipse cx="400" cy="300" rx="200" ry="120" fill="none" stroke="#4D96FF" strokeWidth="1" opacity="0.08"/>
    <line x1="400" y1="100" x2="400" y2="500" stroke="#4D96FF" strokeWidth="1" opacity="0.08"/>
    <line x1="200" y1="300" x2="600" y2="300" stroke="#4D96FF" strokeWidth="1" opacity="0.08"/>
    {/* Continents simplified blobs */}
    <ellipse cx="350" cy="240" rx="55" ry="35" fill="#6BCB77" opacity="0.12"/>
    <ellipse cx="450" cy="270" rx="40" ry="28" fill="#6BCB77" opacity="0.12"/>
    <ellipse cx="340" cy="310" rx="30" ry="20" fill="#6BCB77" opacity="0.12"/>
    <ellipse cx="460" cy="330" rx="25" ry="18" fill="#6BCB77" opacity="0.1"/>
    {/* Airplane */}
    <g transform="translate(650,150) rotate(20)" opacity="0.18">
      <ellipse cx="0" cy="0" rx="30" ry="8" fill="#e0e0e0"/>
      <polygon points="-5,-8 5,-8 8,0 -8,0" fill="#e0e0e0"/>
      <polygon points="-5,8 5,8 8,0 -8,0" fill="#ccc"/>
      <ellipse cx="-20" cy="0" rx="8" ry="4" fill="#e0e0e0"/>
    </g>
    {/* Compass rose */}
    <g transform="translate(700,480)" opacity="0.15">
      {[0,90,180,270].map(a => (
        <polygon key={a} points="0,-20 5,0 -5,0" fill="#7c5cbf" transform={`rotate(${a})`}/>
      ))}
      <circle cx="0" cy="0" r="5" fill="#7c5cbf"/>
    </g>
  </svg>
);

// 11th Grade — architecture
const EleventhBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Blueprint grid */}
    {Array.from({length:12}).map((_,i) => (
      <line key={`h${i}`} x1="0" y1={i*55} x2="800" y2={i*55} stroke="#4D96FF" strokeWidth="0.5" opacity="0.06"/>
    ))}
    {Array.from({length:16}).map((_,i) => (
      <line key={`v${i}`} x1={i*55} y1="0" x2={i*55} y2="600" stroke="#4D96FF" strokeWidth="0.5" opacity="0.06"/>
    ))}
    {/* Arch */}
    <g transform="translate(100,550)" opacity="0.18">
      <path d="M-40,0 L-40,-80 Q-40,-130 0,-130 Q40,-130 40,-80 L40,0" fill="none" stroke="#7c5cbf" strokeWidth="3"/>
      <line x1="-60" y1="0" x2="60" y2="0" stroke="#7c5cbf" strokeWidth="3"/>
    </g>
    {/* Column */}
    <g transform="translate(700,600)" opacity="0.18">
      <rect x="-15" y="-180" width="30" height="180" fill="#e0d0ff"/>
      <rect x="-22" y="-185" width="44" height="12" rx="2" fill="#c8b8ff"/>
      <rect x="-22" y="-12" width="44" height="12" rx="2" fill="#c8b8ff"/>
    </g>
    {/* Triangle/pyramid */}
    <g transform="translate(400,550)" opacity="0.12">
      <polygon points="0,-150 120,0 -120,0" fill="#7c5cbf"/>
      <line x1="0" y1="-150" x2="0" y2="0" stroke="#5a4291" strokeWidth="1"/>
      <line x1="-120" y1="0" x2="120" y2="0" stroke="#5a4291" strokeWidth="1"/>
    </g>
    {/* Ruler */}
    <g transform="translate(50,100) rotate(15)" opacity="0.15">
      <rect x="0" y="0" width="160" height="20" rx="3" fill="#FFD93D"/>
      {Array.from({length:16}).map((_,i) => (
        <line key={i} x1={i*10} y1="0" x2={i*10} y2={i%5===0?14:8} stroke="#c8a800" strokeWidth="1"/>
      ))}
    </g>
  </svg>
);

// 12th Grade — graduation caps and confetti
const TwelfthBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Confetti */}
    {[
      [80,80,'#FF6B6B',15],[150,40,'#FFD93D',20],[250,90,'#4D96FF',12],[400,50,'#6BCB77',18],
      [550,70,'#FF9F43',14],[680,50,'#7c5cbf',16],[730,100,'#FF6B6B',12],[100,200,'#FFD93D',10],
      [600,180,'#4D96FF',14],[300,500,'#6BCB77',16],[700,480,'#FF9F43',12],[150,520,'#7c5cbf',18],
      [500,530,'#FF6B6B',10],[420,100,'#FFD93D',15]
    ].map(([x,y,c,r],i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${i*25})`} opacity="0.2">
        <rect x={-Number(r)/2} y={-Number(r)/2} width={r} height={Number(r)/2} rx="2" fill={String(c)}/>
      </g>
    ))}
    {/* Graduation caps */}
    <g transform="translate(120,150)" opacity="0.2">
      <polygon points="0,-20 50,0 0,20 -50,0" fill="#333"/>
      <rect x="-8" y="0" width="16" height="30" fill="#555"/>
      <line x1="30" y1="8" x2="30" y2="28" stroke="#FFD93D" strokeWidth="2"/>
      <circle cx="30" cy="30" r="4" fill="#FFD93D"/>
    </g>
    <g transform="translate(660,180)" opacity="0.2">
      <polygon points="0,-16 40,0 0,16 -40,0" fill="#333"/>
      <rect x="-6" y="0" width="12" height="24" fill="#555"/>
      <line x1="24" y1="6" x2="24" y2="22" stroke="#FFD93D" strokeWidth="2"/>
      <circle cx="24" cy="24" r="3" fill="#FFD93D"/>
    </g>
    {/* Trophy */}
    <g transform="translate(400,480)" opacity="0.18">
      <path d="M-25,-60 Q-30,-20 -20,0 Q-10,20 0,20 Q10,20 20,0 Q30,-20 25,-60Z" fill="#FFD93D"/>
      <path d="M-25,-60 Q-40,-60 -40,-40 Q-40,-20 -25,-20" fill="none" stroke="#FFD93D" strokeWidth="4"/>
      <path d="M25,-60 Q40,-60 40,-40 Q40,-20 25,-20" fill="none" stroke="#FFD93D" strokeWidth="4"/>
      <rect x="-8" y="20" width="16" height="20" fill="#c8a800"/>
      <rect x="-20" y="40" width="40" height="8" rx="3" fill="#c8a800"/>
    </g>
  </svg>
);

// Finals — stars, magic, sparkles
const FinalsBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {/* Large stars */}
    {[[80,100],[200,60],[400,40],[600,70],[720,100],[100,300],[700,280],[350,500],[150,480],[650,460]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.2">
        {[0,72,144,216,288].map(a => (
          <polygon key={a} points={`0,-${14+i%3*4} 3,-5 ${14+i%3*4},0 3,5 0,${14+i%3*4} -3,5 -${14+i%3*4},0 -3,-5`} fill="#FFD93D" transform={`rotate(${a/5})`}/>
        ))}
      </g>
    ))}
    {/* Sparkles */}
    {[[300,150],[500,200],[150,350],[650,330]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.25">
        <line x1="0" y1="-15" x2="0" y2="15" stroke="#FFD93D" strokeWidth="2"/>
        <line x1="-15" y1="0" x2="15" y2="0" stroke="#FFD93D" strokeWidth="2"/>
        <line x1="-10" y1="-10" x2="10" y2="10" stroke="#FFD93D" strokeWidth="1.5"/>
        <line x1="10" y1="-10" x2="-10" y2="10" stroke="#FFD93D" strokeWidth="1.5"/>
      </g>
    ))}
    {/* Crown */}
    <g transform="translate(400,520)" opacity="0.18">
      <polygon points="-40,0 -40,-40 -20,-25 0,-45 20,-25 40,-40 40,0" fill="#FFD93D"/>
      <rect x="-40" y="0" width="80" height="12" rx="3" fill="#FFD93D"/>
      {[-20,0,20].map(x => <circle key={x} cx={x} cy={-10} r="5" fill="#FF6B6B"/>)}
    </g>
  </svg>
);

// All Words — colorful mix
const AllWordsBG: React.FC<BGProps> = ({ opacity }) => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    {['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map((l,i) => (
      <text key={l} x={(i%8)*100+50} y={Math.floor(i/8)*120+80} fontSize="36" fontWeight="bold"
        fill={['#FF6B6B','#FFD93D','#4D96FF','#6BCB77','#FF9F43','#7c5cbf','#FF6B6B','#4D96FF'][i%8]}
        opacity="0.08" fontFamily="Fredoka One, cursive">{l}</text>
    ))}
  </svg>
);

const BG_MAP: Record<GradeKey, React.FC<BGProps>> = {
  'K': KinderBG, '1st': FirstBG, '2nd': SecondBG, '3rd': ThirdBG,
  '4th': FourthBG, '5th': FifthBG, '6th': SixthBG, '7th': SeventhBG,
  '8th': EighthBG, '9th': NinthBG, '10th': TenthBG, '11th': EleventhBG,
  '12th': TwelfthBG, 'finals': FinalsBG, 'all': AllWordsBG, 'custom': AllWordsBG,
};

const THEME_COLORS: Record<GradeKey, string> = {
  'K':     '#fff5f5',  '1st': '#fff8f0',  '2nd': '#f0f4ff',  '3rd': '#f0fff4',
  '4th':   '#f0f8ff',  '5th': '#f5f0ff',  '6th': '#fffff0',  '7th': '#fff0ff',
  '8th':   '#f0ffff',  '9th': '#fffaf0',  '10th':'#f0f8f0',  '11th':'#f5f0ff',
  '12th':  '#fffdf0',  'finals':'#fffbf0','all':  '#fff9f0',  'custom':'#fff9f0',
};

interface GradeBackgroundProps { grade: GradeKey; }

const ALL_GRADES = Object.keys(BG_MAP) as GradeKey[];

export const GradeBackground: React.FC<GradeBackgroundProps> = ({ grade }) => {
  const [activeGrade, setActiveGrade] = useState<GradeKey>(grade);
  const [fadingOut, setFadingOut] = useState<GradeKey | null>(null);

  useEffect(() => {
    if (grade === activeGrade) return;
    setFadingOut(activeGrade);
    setActiveGrade(grade);
    const t = setTimeout(() => setFadingOut(null), 700);
    return () => clearTimeout(t);
  }, [grade]); // eslint-disable-line

  useEffect(() => {
    document.body.style.background = THEME_COLORS[grade] || '#fff9f0';
    document.body.style.transition = 'background 0.7s ease';
  }, [grade]);

  return (
    <>
      {ALL_GRADES.map(g => {
        const BG = BG_MAP[g];
        const isActive = g === activeGrade;
        const isFading = g === fadingOut;
        const opacity = isActive ? 1 : isFading ? 0 : 0;
        const visible = isActive || isFading;
        if (!visible) return null;
        return (
          <div
            key={g}
            style={{
              position: 'fixed', inset: 0,
              overflow: 'hidden',
              opacity,
              transition: 'opacity 0.7s ease',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <BG opacity={1} />
          </div>
        );
      })}
    </>
  );
};
