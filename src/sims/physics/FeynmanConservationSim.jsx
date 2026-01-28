import React, { useState, useRef, useEffect } from 'react';

const TOTAL_BLOCKS = 28;
const BLOCK_WEIGHT = 3;
const TOYBOX_EMPTY_WEIGHT = 16;
const BATHTUB_BASE_LEVEL = 6;
const BLOCK_LEVEL_INCREASE = 0.25;

export default function ConservationOfEnergy() {
  const [mode, setMode] = useState('home'); // 'home', 'plot', 'playground' or 'game'
  const [playgroundStarted, setPlaygroundStarted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false);
    
  const [blocks, setBlocks] = useState(() => {
    const initial = [];
    const blockSize = 50;
    
    // Group 1: 18 blocks - upper middle area
    // Bounded by: toybox right edge, garden left edge, living room top, above rug
    const group1Bounds = {
      minX: 160,  // right of toybox (toybox is at x:20, width ~130)
      maxX: 450,  // left of garden/scale area
      minY: 45,   // below living room label
      maxY: 160   // well above rug (rug top is at y:210)
    };
    
    // Group 2: 10 blocks - lower left area (LEFT of rug, below toybox)
    // Rug is at x:240, so stay to the left of it
    const group2Bounds = {
      minX: 15,   // living room left edge
      maxX: 180,  // LEFT of rug (rug starts at x:240, minus block size and padding)
      minY: 165,  // below toybox (toybox bottom is around y:150)
      maxY: 280   // above corridor
    };
    
    // Generate Group 1 (18 blocks)
    for (let i = 0; i < 18; i++) {
      const x = group1Bounds.minX + Math.random() * (group1Bounds.maxX - group1Bounds.minX - blockSize);
      const y = group1Bounds.minY + Math.random() * (group1Bounds.maxY - group1Bounds.minY - blockSize);
      initial.push({
        id: i,
        x,
        y,
        visible: true,
        hiddenIn: null,
        hiddenDisplayPos: null
      });
    }
    
    // Generate Group 2 (10 blocks)
    for (let i = 18; i < TOTAL_BLOCKS; i++) {
      const x = group2Bounds.minX + Math.random() * (group2Bounds.maxX - group2Bounds.minX - blockSize);
      const y = group2Bounds.minY + Math.random() * (group2Bounds.maxY - group2Bounds.minY - blockSize);
      initial.push({
        id: i,
        x,
        y,
        visible: true,
        hiddenIn: null,
        hiddenDisplayPos: null
      });
    }
    
    return initial;
  });

  const [toyboxPos, setToyboxPos] = useState({ x: 20, y: 40 });
  const [toyboxOpen, setToyboxOpen] = useState(false);
  const [toyboxHovered, setToyboxHovered] = useState(false);
  const [scalePos, setScalePos] = useState({ x: 540, y: 160 });
  // Bathtub: 160w x 100h
  // Bathroom is roughly 550px wide x 180px tall (40% of ~450px container)
  // Center: x = (550 - 160) / 2 ≈ 195, y = (180 - 100) / 2 ≈ 40
  const [bathtubPos, setBathtubPos] = useState({ x: 235, y: 125 });
  const [rugPos, setRugPos] = useState({ x: 240, y: 210 });
  const [rugFolded, setRugFolded] = useState(false);
  const [rugHovered, setRugHovered] = useState(false);
  const [windowOpen, setWindowOpen] = useState(false);
  const [windowHovered, setWindowHovered] = useState(false);
  const [livingRoomDoorOpen, setLivingRoomDoorOpen] = useState(false);
  const [livingRoomDoorHovered, setLivingRoomDoorHovered] = useState(false);
  const [bathroomDoorOpen, setBathroomDoorOpen] = useState(false);
  const [bathroomDoorHovered, setBathroomDoorHovered] = useState(false);
  const [momMode, setMomMode] = useState(false); // false = Dennis mode (can retrieve), true = Mom mode (cannot retrieve)
  
  const [measurements, setMeasurements] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorPos, setCalculatorPos] = useState(null);
  const [calculatorFormula, setCalculatorFormula] = useState([]);
  const [calculatorOutputType, setCalculatorOutputType] = useState('toybox'); // 'toybox', 'bathtub', 'total', 'custom'
  const [calculatorCustomName, setCalculatorCustomName] = useState('');
  const [calculatorCustomUnit, setCalculatorCustomUnit] = useState('blocks');
  const [calculatorLastResult, setCalculatorLastResult] = useState(null);
  const [calculatorResults, setCalculatorResults] = useState({
    toybox: null,
    bathtub: null,
    total: null
  });
  const [showRulerSaveDialog, setShowRulerSaveDialog] = useState(false);
  const [rulerSaveName, setRulerSaveName] = useState('');
  const [rulerDialogPos, setRulerDialogPos] = useState(null);
  const [showScaleSaveDialog, setShowScaleSaveDialog] = useState(false);
  const [scaleSaveName, setScaleSaveName] = useState('');
  const [scaleDialogPos, setScaleDialogPos] = useState(null);
  const [showCustomMeasurementDialog, setShowCustomMeasurementDialog] = useState(false);
  const [customMeasurementName, setCustomMeasurementName] = useState('');
  const [customMeasurementValue, setCustomMeasurementValue] = useState('');
  const [customMeasurementUnit, setCustomMeasurementUnit] = useState('oz');
  const [customDialogPos, setCustomDialogPos] = useState(null);
  
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const roomRef = useRef(null);

  // Helper function to compute display position when hiding a block in garden
  const computeGardenDisplayPos = (currentBlocks) => {
    const gardenPositions = [
      { x: 10, y: 10 }, { x: 40, y: 10 }, { x: 70, y: 10 },
      { x: 10, y: 40 }, { x: 40, y: 40 }, { x: 70, y: 40 },
      { x: 10, y: 70 }, { x: 40, y: 70 }, { x: 70, y: 70 },
    ];
    const blockSize = 24;
    const gardenBounds = { minX: 5, maxX: 90, minY: 5, maxY: 85 };
    
    const hiddenInGarden = currentBlocks.filter(b => b.hiddenIn === 'garden').length;
    const basePos = gardenPositions[hiddenInGarden % gardenPositions.length];
    
    if (hiddenInGarden < gardenPositions.length) {
      return { ...basePos };
    }
    // Apply random shift for subsequent passes, keep within bounds
    const shiftX = (Math.random() - 0.5) * 30;
    const shiftY = (Math.random() - 0.5) * 30;
    return {
      x: Math.max(gardenBounds.minX, Math.min(gardenBounds.maxX - blockSize, basePos.x + shiftX)),
      y: Math.max(gardenBounds.minY, Math.min(gardenBounds.maxY - blockSize, basePos.y + shiftY))
    };
  };

  // Helper function to compute display position when hiding a block under rug
  const computeRugDisplayPos = (currentBlocks) => {
    const bulgePositions = [
      { x: 20, y: 20 }, { x: 55, y: 20 }, { x: 90, y: 20 },
      { x: 20, y: 50 }, { x: 55, y: 50 }, { x: 90, y: 50 },
    ];
    const bulgeSize = 25;
    const rugBounds = { minX: 10, maxX: 105, minY: 10, maxY: 65 };
    
    const hiddenUnderRug = currentBlocks.filter(b => b.hiddenIn === 'rug').length;
    const basePos = bulgePositions[hiddenUnderRug % bulgePositions.length];
    
    if (hiddenUnderRug < bulgePositions.length) {
      return { ...basePos };
    }
    // Apply random shift for subsequent passes, keep within bounds
    const shiftX = (Math.random() - 0.5) * 25;
    const shiftY = (Math.random() - 0.5) * 20;
    return {
      x: Math.max(rugBounds.minX, Math.min(rugBounds.maxX - bulgeSize, basePos.x + shiftX)),
      y: Math.max(rugBounds.minY, Math.min(rugBounds.maxY - bulgeSize, basePos.y + shiftY))
    };
  };

  // Calculate what's on the scale (in living room)
  // Collision: object's center must be close to the center of the grey weighing pad
  const getScaleWeight = () => {
    const blockSize = 50;
    // Grey region: starts at scalePos.y (after the 48px display), height 100px, width 90px
    // But scalePos.y is the top of the display, grey region starts at scalePos.y + 48
    const greyTop = scalePos.y + 48;
    const greyHeight = 100;
    const greyWidth = 90;
    const greyCenterX = scalePos.x + greyWidth / 2;
    const greyCenterY = greyTop + greyHeight / 2;
    const tolerance = 40; // how close center must be to count
    
    // Check if toybox center is close to grey region center
    const toyboxCenterX = toyboxPos.x + 65; // toybox is 130px wide
    const toyboxCenterY = toyboxPos.y + 55; // toybox is 110px tall
    const toyboxDist = Math.sqrt(Math.pow(toyboxCenterX - greyCenterX, 2) + Math.pow(toyboxCenterY - greyCenterY, 2));
    
    if (toyboxDist < tolerance + 30) { // larger tolerance for toybox since it's bigger
      const hiddenInToybox = blocks.filter(b => b.hiddenIn === 'toybox').length;
      return TOYBOX_EMPTY_WEIGHT + hiddenInToybox * BLOCK_WEIGHT;
    }
    
    // Check for individual blocks - center must be close to grey region center
    let weight = 0;
    blocks.filter(b => b.visible).forEach(block => {
      const blockCenterX = block.x + blockSize / 2;
      const blockCenterY = block.y + blockSize / 2;
      const dist = Math.sqrt(Math.pow(blockCenterX - greyCenterX, 2) + Math.pow(blockCenterY - greyCenterY, 2));
      if (dist < tolerance) {
        weight += BLOCK_WEIGHT;
      }
    });
    return weight;
  };

  // Calculate water level (ruler dragged to bathtub in bathroom)
  // Since ruler position is now managed by DOM, we'll use a ref to track it
  const [rulerPos, setRulerPos] = useState({ x: 540, y: 60 });
  
  const getWaterLevel = () => {
    // Check if ruler overlaps with bathtub (bathtub center is at 235, 125, size 380x240)
    // Bathtub left = 235 - 110 = 125, top = 125 - 70 = 55
    const bathtubArea = { x: 125, y: 55, width: 380, height: 240 };
    
    // Ruler is approximately at its position, 70px wide, 140px tall (including display)
    const rulerOverlaps = 
      rulerPos.x < bathtubArea.x + bathtubArea.width &&
      rulerPos.x + 70 > bathtubArea.x &&
      rulerPos.y < bathtubArea.y + bathtubArea.height &&
      rulerPos.y + 140 > bathtubArea.y;
    
    if (rulerOverlaps) {
      const hiddenInBathtub = blocks.filter(b => b.hiddenIn === 'bathtub').length;
      const actualLevel = BATHTUB_BASE_LEVEL + hiddenInBathtub * BLOCK_LEVEL_INCREASE;
      // Water overflows at 9 inches (bathtub rim height)
      return Math.min(actualLevel, 9);
    }
    return 0;
  };

  const scaleWeight = getScaleWeight();
  const waterLevel = getWaterLevel();

  // Mouse handlers
  const handleMouseDown = (e, type, id = null, roomArea = 'living') => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.closest('[data-room]')?.getBoundingClientRect() || 
                 roomRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let targetPos;
    if (type === 'block') {
      const block = blocks.find(b => b.id === id);
      targetPos = { x: block.x, y: block.y };
    } else if (type === 'toybox') {
      targetPos = toyboxPos;
    } else if (type === 'bathtub') {
      targetPos = bathtubPos;
    } else if (type === 'rug') {
      targetPos = rugPos;
    }
    
    setDragOffset({
      x: e.clientX - rect.left - targetPos.x,
      y: e.clientY - rect.top - targetPos.y
    });
    setDragging({ type, id, roomArea });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      
      // For blocks, use the entire room container, not just the starting room
      if (dragging.type === 'block') {
        const roomContainer = document.querySelector('[data-room-container]');
        if (!roomContainer) return;
        
        const rect = roomContainer.getBoundingClientRect();
        let newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 30));
        let newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 30));
        
        // Get the current block position to determine which room it's in
        const currentBlock = blocks.find(b => b.id === dragging.id);
        if (currentBlock) {
          const livingRoom = document.querySelector('[data-room="living"]');
          const bathroom = document.querySelector('[data-room="bathroom"]');
          
          if (livingRoom && bathroom) {
            const livingRect = livingRoom.getBoundingClientRect();
            const bathroomRect = bathroom.getBoundingClientRect();
            const containerRect = roomContainer.getBoundingClientRect();
            
            const livingBottom = livingRect.bottom - containerRect.top;
            const bathroomTop = bathroomRect.top - containerRect.top;
            
            // Check if block is trying to cross between rooms
            const blockCenterY = currentBlock.y + 25; // center of 50px block
            const blockCurrentlyInLiving = blockCenterY < livingBottom;
            const blockCurrentlyInBathroom = blockCenterY > bathroomTop;
            const blockCurrentlyInCorridor = !blockCurrentlyInLiving && !blockCurrentlyInBathroom;
            
            const newBlockCenterY = newY + 25;
            const newPosInLiving = newBlockCenterY < livingBottom;
            const newPosInBathroom = newBlockCenterY > bathroomTop;
            
            // Blocks can ONLY move between rooms when BOTH doors are open
            const bothDoorsOpen = livingRoomDoorOpen && bathroomDoorOpen;
            
            if (!bothDoorsOpen) {
              // Keep block in its current room
              if (blockCurrentlyInLiving) {
                // Block is in living room - cannot leave
                if (newBlockCenterY >= livingBottom) {
                  newY = livingBottom - 26; // keep center inside living room
                }
              } else if (blockCurrentlyInBathroom) {
                // Block is in bathroom - cannot leave
                if (newBlockCenterY <= bathroomTop) {
                  newY = bathroomTop - 24; // keep center inside bathroom
                }
              } else if (blockCurrentlyInCorridor) {
                // Block is in corridor - cannot enter either room
                if (newPosInLiving) {
                  newY = livingBottom - 24; // stop at living room boundary
                } else if (newPosInBathroom) {
                  newY = bathroomTop - 26; // stop at bathroom boundary
                }
              }
            }
          }
        }
        
        setBlocks(prev => prev.map(b => 
          b.id === dragging.id ? { ...b, x: newX, y: newY } : b
        ));
      } else {
        // For toybox and other items, keep them in their room
        const roomArea = dragging.roomArea;
        const roomElement = document.querySelector(`[data-room="${roomArea}"]`);
        if (!roomElement) return;
        
        const rect = roomElement.getBoundingClientRect();
        const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 30));
        const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 30));
        
        if (dragging.type === 'toybox') {
          setToyboxPos({ x: newX, y: newY });
        } else if (dragging.type === 'bathtub') {
          setBathtubPos({ x: newX, y: newY });
        } else if (dragging.type === 'rug') {
          setRugPos({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = (e) => {
      if (!dragging) return;
      
      if (dragging.type === 'block') {
        const roomContainer = document.querySelector('[data-room-container]');
        if (!roomContainer) { setDragging(null); return; }
        
        const rect = roomContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;
        
        // Get living room bounds for toybox check
        const livingRoom = document.querySelector('[data-room="living"]');
        const livingRect = livingRoom?.getBoundingClientRect();
        const livingOffset = livingRect ? { x: livingRect.left - rect.left, y: livingRect.top - rect.top } : { x: 0, y: 0 };
        
        // Get bathroom bounds for bathtub check
        const bathroom = document.querySelector('[data-room="bathroom"]');
        const bathroomRect = bathroom?.getBoundingClientRect();
        const bathroomOffset = bathroomRect ? { x: bathroomRect.left - rect.left, y: bathroomRect.top - rect.top } : { x: 0, y: 0 };
        
        // Check if dropped on toybox (ONLY via TOP EDGE when OPEN)
        const toyboxAbsX = livingOffset.x + toyboxPos.x;
        const toyboxAbsY = livingOffset.y + toyboxPos.y;
        const blockSize = 50; // block size
        const blockCenterX = x + blockSize / 2;
        const blockCenterY = y + blockSize / 2;
        
        // Toybox: 130w x 110h, only accept via top edge (top 20px) when open
        const toyboxTopEdge = 20;
        let blockHandled = false;
        
        if (toyboxOpen &&
            blockCenterX > toyboxAbsX && blockCenterX < toyboxAbsX + 130 &&
            blockCenterY > toyboxAbsY && blockCenterY < toyboxAbsY + toyboxTopEdge) {
          setBlocks(prev => prev.map(b => 
            b.id === dragging.id ? { ...b, visible: false, hiddenIn: 'toybox' } : b
          ));
          blockHandled = true;
        }
        
        // Check if dropped on window (ONLY the window element) when window is open
        if (!blockHandled && windowOpen) {
          const windowEl = document.querySelector('[data-window]');
          if (windowEl) {
            const windowRect = windowEl.getBoundingClientRect();
            const windowAbsX = windowRect.left - rect.left;
            const windowAbsY = windowRect.top - rect.top;
            if (blockCenterX > windowAbsX && blockCenterX < windowAbsX + windowRect.width &&
                blockCenterY > windowAbsY && blockCenterY < windowAbsY + windowRect.height) {
              setBlocks(prev => {
                const displayPos = computeGardenDisplayPos(prev);
                return prev.map(b => 
                  b.id === dragging.id ? { ...b, visible: false, hiddenIn: 'garden', hiddenDisplayPos: displayPos } : b
                );
              });
              blockHandled = true;
            }
          }
        }
        
        // Check rug (only if unfolded)
        if (!blockHandled && !rugFolded) {
          const rugEl = document.querySelector('[data-rug]');
          if (rugEl) {
            const rugRect = rugEl.getBoundingClientRect();
            const rugAbsX = rugRect.left - rect.left;
            const rugAbsY = rugRect.top - rect.top;
            const rugWidth = rugRect.width;
            const rugHeight = rugRect.height;
            
            // Rug: only accept via EDGES, not center
            const edgeThickness = 20;
            
            const onLeftEdge = blockCenterX > rugAbsX && blockCenterX < rugAbsX + edgeThickness &&
                               blockCenterY > rugAbsY && blockCenterY < rugAbsY + rugHeight;
            const onRightEdge = blockCenterX > rugAbsX + rugWidth - edgeThickness && blockCenterX < rugAbsX + rugWidth &&
                                blockCenterY > rugAbsY && blockCenterY < rugAbsY + rugHeight;
            const onTopEdge = blockCenterY > rugAbsY && blockCenterY < rugAbsY + edgeThickness &&
                              blockCenterX > rugAbsX && blockCenterX < rugAbsX + rugWidth;
            const onBottomEdge = blockCenterY > rugAbsY + rugHeight - edgeThickness && blockCenterY < rugAbsY + rugHeight &&
                                 blockCenterX > rugAbsX && blockCenterX < rugAbsX + rugWidth;
            
            if (onLeftEdge || onRightEdge || onTopEdge || onBottomEdge) {
              setBlocks(prev => {
                const displayPos = computeRugDisplayPos(prev);
                return prev.map(b => 
                  b.id === dragging.id ? { ...b, visible: false, hiddenIn: 'rug', hiddenDisplayPos: displayPos } : b
                );
              });
              blockHandled = true;
            }
          }
        }
        
        // Check bathtub - use DOM element like we do for window/rug
        // Max 12 blocks (water level caps at 9 inches: 6 + 12*0.25 = 9)
        if (!blockHandled) {
          const bathtubEl = document.querySelector('[data-bathtub]');
          if (bathtubEl) {
            const currentBathtubBlocks = blocks.filter(b => b.hiddenIn === 'bathtub').length;
            const bathtubFull = currentBathtubBlocks >= 12;
            
            if (!bathtubFull) {
              const bathtubRect = bathtubEl.getBoundingClientRect();
              const bathtubAbsX = bathtubRect.left - rect.left;
              const bathtubAbsY = bathtubRect.top - rect.top;
              const bathtubWidth = bathtubRect.width;
              const bathtubTopEdge = 100; // top 100px for easier targeting
              
              if (blockCenterX > bathtubAbsX && blockCenterX < bathtubAbsX + bathtubWidth &&
                  blockCenterY > bathtubAbsY && blockCenterY < bathtubAbsY + bathtubTopEdge) {
                setBlocks(prev => prev.map(b => 
                  b.id === dragging.id ? { ...b, visible: false, hiddenIn: 'bathtub' } : b
                ));
              }
            }
          }
        }
      }
      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragOffset, toyboxPos, toyboxOpen, bathtubPos, rugFolded, windowOpen, livingRoomDoorOpen, bathroomDoorOpen, blocks]);

  // Retrieve a block from a hidden location
  const retrieveBlock = (location) => {
    // Cannot retrieve from toybox if it's closed (locked)
    if (location === 'toybox' && !toyboxOpen) {
      return;
    }
    
    // Cannot retrieve from bathtub in Mom mode
    if (location === 'bathtub' && momMode) {
      return;
    }
    
    const hidden = blocks.find(b => b.hiddenIn === location);
    if (hidden) {
      // Get container and room references for coordinate conversion
      const roomContainer = document.querySelector('[data-room-container]');
      const livingRoom = document.querySelector('[data-room="living"]');
      const bathroom = document.querySelector('[data-room="bathroom"]');
      
      if (!roomContainer || !livingRoom || !bathroom) return;
      
      const containerRect = roomContainer.getBoundingClientRect();
      const livingRect = livingRoom.getBoundingClientRect();
      const bathroomRect = bathroom.getBoundingClientRect();
      
      // Calculate offsets for each room relative to container
      const livingOffset = { x: livingRect.left - containerRect.left, y: livingRect.top - containerRect.top };
      const bathroomOffset = { x: bathroomRect.left - containerRect.left, y: bathroomRect.top - containerRect.top };
      
      // Helper function to check if a position is occupied by any visible block
      const isPositionOccupied = (x, y) => {
        const threshold = 40; // blocks closer than this are considered overlapping
        return blocks.some(b => {
          if (!b.visible) return false;
          const dx = Math.abs(b.x - x);
          const dy = Math.abs(b.y - y);
          return dx < threshold && dy < threshold;
        });
      };
      
      // Helper function to apply random shift (half block size = 25px)
      const applyRandomShift = (x, y) => {
        return {
          x: x + (Math.random() - 0.5) * 50,
          y: y + (Math.random() - 0.5) * 50
        };
      };
      
      let newX, newY;
      
      if (location === 'toybox') {
        const visibleInLiving = blocks.filter(b => {
          if (!b.visible) return false;
          const blockCenterY = b.y + 25;
          return blockCenterY < livingOffset.y + livingRect.height;
        }).length;
        
        const rightPositions = [
          { x: 160, y: 40 },
          { x: 160, y: 100 },
          { x: 160, y: 160 },
          { x: 220, y: 40 },
          { x: 220, y: 100 },
          { x: 220, y: 160 },
        ];
        
        const posIndex = visibleInLiving % rightPositions.length;
        let baseX = livingOffset.x + rightPositions[posIndex].x;
        let baseY = livingOffset.y + rightPositions[posIndex].y;
        
        // If occupied OR on second+ pass through array, apply random shift
        if (isPositionOccupied(baseX, baseY) || visibleInLiving >= rightPositions.length) {
          const shifted = applyRandomShift(baseX, baseY);
          newX = shifted.x;
          newY = shifted.y;
        } else {
          newX = baseX;
          newY = baseY;
        }
      } else if (location === 'bathtub') {
        const visibleInBathroom = blocks.filter(b => {
          if (!b.visible) return false;
          const blockCenterY = b.y + 25;
          return blockCenterY > bathroomOffset.y;
        }).length;
        
        const leftPositions = [
          { x: 20, y: 60 },
          { x: 20, y: 120 },
          { x: 20, y: 180 },
          { x: 70, y: 60 },
          { x: 70, y: 120 },
          { x: 70, y: 180 },
        ];
        
        const posIndex = visibleInBathroom % leftPositions.length;
        let baseX = bathroomOffset.x + leftPositions[posIndex].x;
        let baseY = bathroomOffset.y + leftPositions[posIndex].y;
        
        if (isPositionOccupied(baseX, baseY) || visibleInBathroom >= leftPositions.length) {
          const shifted = applyRandomShift(baseX, baseY);
          newX = shifted.x;
          newY = shifted.y;
        } else {
          newX = baseX;
          newY = baseY;
        }
      } else if (location === 'rug') {
        const visibleInLiving = blocks.filter(b => {
          if (!b.visible) return false;
          const blockCenterY = b.y + 25;
          return blockCenterY < livingOffset.y + livingRect.height;
        }).length;
        
        const rugPositions = [
          { x: 160, y: 180 },
          { x: 160, y: 240 },
          { x: 100, y: 180 },
          { x: 100, y: 240 },
          { x: 40, y: 180 },
          { x: 40, y: 240 },
        ];
        
        const posIndex = visibleInLiving % rugPositions.length;
        let baseX = livingOffset.x + rugPositions[posIndex].x;
        let baseY = livingOffset.y + rugPositions[posIndex].y;
        
        if (isPositionOccupied(baseX, baseY) || visibleInLiving >= rugPositions.length) {
          const shifted = applyRandomShift(baseX, baseY);
          newX = shifted.x;
          newY = shifted.y;
        } else {
          newX = baseX;
          newY = baseY;
        }
      } else if (location === 'garden') {
        const visibleInLiving = blocks.filter(b => {
          if (!b.visible) return false;
          const blockCenterY = b.y + 25;
          return blockCenterY < livingOffset.y + livingRect.height;
        }).length;
        
        const gardenPositions = [
          { x: 280, y: 40 },
          { x: 280, y: 100 },
          { x: 340, y: 40 },
          { x: 340, y: 100 },
          { x: 400, y: 40 },
          { x: 400, y: 100 },
        ];
        
        const posIndex = visibleInLiving % gardenPositions.length;
        let baseX = livingOffset.x + gardenPositions[posIndex].x;
        let baseY = livingOffset.y + gardenPositions[posIndex].y;
        
        if (isPositionOccupied(baseX, baseY) || visibleInLiving >= gardenPositions.length) {
          const shifted = applyRandomShift(baseX, baseY);
          newX = shifted.x;
          newY = shifted.y;
        } else {
          newX = baseX;
          newY = baseY;
        }
      } else {
        newX = 100;
        newY = 100;
      }
      
      setBlocks(prev => prev.map(b => 
        b.id === hidden.id 
          ? { ...b, visible: true, hiddenIn: null, hiddenDisplayPos: null, x: newX, y: newY }
          : b
      ));
    }
  };

  // Check if calculator formula is a computable expression
  const isComputable = (formula) => {
    if (!formula || formula.length === 0) return false;
    
    // Convert formula array to tokens (numbers and operators)
    const tokens = formula.map(item => {
      if (item.type === 'measurement') return { type: 'number', value: item.value };
      if (item.type === 'operator') return { type: 'operator', value: item.value };
      return null;
    }).filter(Boolean);
    
    // Recursive check function
    const check = (tokens) => {
      if (tokens.length === 0) return false;
      
      // Base case: single number
      if (tokens.length === 1 && tokens[0].type === 'number') {
        return true;
      }
      
      // Check if wrapped in parentheses
      if (tokens[0].value === '(' && tokens[tokens.length - 1].value === ')') {
        // Verify these parentheses match each other
        let depth = 0;
        let matchesOuter = true;
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].value === '(') depth++;
          if (tokens[i].value === ')') depth--;
          // If depth hits 0 before the end, outer parens don't match each other
          if (depth === 0 && i < tokens.length - 1) {
            matchesOuter = false;
            break;
          }
        }
        if (matchesOuter && depth === 0) {
          // Remove outer parentheses and check inner
          return check(tokens.slice(1, -1));
        }
      }
      
      // Find operator at depth 0 and split
      let depth = 0;
      // Scan right to left to respect left-to-right evaluation (find last operator at depth 0)
      for (let i = tokens.length - 1; i >= 0; i--) {
        const token = tokens[i];
        if (token.value === ')') depth++;
        if (token.value === '(') depth--;
        
        if (depth === 0 && token.type === 'operator' && ['+', '-', '/'].includes(token.value)) {
          const left = tokens.slice(0, i);
          const right = tokens.slice(i + 1);
          
          if (left.length > 0 && right.length > 0) {
            return check(left) && check(right);
          }
        }
      }
      
      return false;
    };
    
    // Also verify parentheses are balanced overall
    let depth = 0;
    for (const token of tokens) {
      if (token.value === '(') depth++;
      if (token.value === ')') depth--;
      if (depth < 0) return false; // More closing than opening
    }
    if (depth !== 0) return false; // Unbalanced
    
    return check(tokens);
  };

  // Save measurement
  const saveMeasurement = (value, type, unit) => {
    setMeasurements(prev => [{
      id: Date.now(),
      value,
      type,
      unit,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  // Reset
  const reset = () => {
    if (mode === 'game') {
      initializeGame();
      return;
    }
    
    const newBlocks = [];
    const blockSize = 50;
    
    // Group 1: 18 blocks - upper middle area
    const group1Bounds = {
      minX: 160,
      maxX: 450,
      minY: 45,
      maxY: 160
    };
    
    // Group 2: 10 blocks - lower left area (LEFT of rug)
    const group2Bounds = {
      minX: 15,
      maxX: 180,
      minY: 165,
      maxY: 280
    };
    
    // Generate Group 1 (18 blocks)
    for (let i = 0; i < 18; i++) {
      const x = group1Bounds.minX + Math.random() * (group1Bounds.maxX - group1Bounds.minX - blockSize);
      const y = group1Bounds.minY + Math.random() * (group1Bounds.maxY - group1Bounds.minY - blockSize);
      newBlocks.push({
        id: i,
        x,
        y,
        visible: true,
        hiddenIn: null,
        hiddenDisplayPos: null
      });
    }
    
    // Generate Group 2 (10 blocks)
    for (let i = 18; i < TOTAL_BLOCKS; i++) {
      const x = group2Bounds.minX + Math.random() * (group2Bounds.maxX - group2Bounds.minX - blockSize);
      const y = group2Bounds.minY + Math.random() * (group2Bounds.maxY - group2Bounds.minY - blockSize);
      newBlocks.push({
        id: i,
        x,
        y,
        visible: true,
        hiddenIn: null,
        hiddenDisplayPos: null
      });
    }
    
    setBlocks(newBlocks);
    setToyboxPos({ x: 20, y: 40 });
    setToyboxOpen(false);
    setBathtubPos({ x: 235, y: 125 });
    setScalePos({ x: 540, y: 160 });
    setRulerPos({ x: 540, y: 60 });
    setRugPos({ x: 240, y: 210 });
    setRugFolded(false);
    setWindowOpen(false);
    setLivingRoomDoorOpen(false);
    setBathroomDoorOpen(false);
    setMomMode(false);
    setMeasurements([]);
    setShowCalculator(false);
    setCalculatorFormula([]);
    setCalculatorOutputType('toybox');
    setCalculatorCustomName('');
    setCalculatorCustomUnit('blocks');
    setCalculatorLastResult(null);
    setCalculatorResults({ toybox: null, bathtub: null, total: null });
  };

  // Initialize Game with preset block distribution
  const initializeGame = () => {
    const newBlocks = [];
    const blockSize = 50;
    let blockId = 0;
    
    // Living Room Visible: 6 blocks
    const livingRoomBounds = {
      minX: 160,
      maxX: 450,
      minY: 45,
      maxY: 160
    };
    for (let i = 0; i < 6; i++) {
      const x = livingRoomBounds.minX + Math.random() * (livingRoomBounds.maxX - livingRoomBounds.minX - blockSize);
      const y = livingRoomBounds.minY + Math.random() * (livingRoomBounds.maxY - livingRoomBounds.minY - blockSize);
      newBlocks.push({
        id: blockId++,
        x,
        y,
        visible: true,
        hiddenIn: null,
        hiddenDisplayPos: null
      });
    }
    
    // Bathroom Visible: 3 blocks
    // Blocks are positioned relative to the room-container (not individual rooms)
    // Layout: Living Room 40%, Corridor 20%, Bathroom 40%
    // Bathroom starts at 60% of container height
    // We need to query the actual DOM to get proper coordinates, but for initialization
    // we'll estimate based on typical container height (~880px visible)
    // Bathroom starts around y=528, so blocks should be y > 540 to be safely inside
    // Using relative positioning: blocks at y=50-120 within bathroom = y=580-650 in container
    const bathroomBounds = {
      minX: 50,
      maxX: 400,
      minY: 40,  // relative to bathroom top
      maxY: 120
    };
    
    // Get bathroom offset - we'll add this when positioning
    // For now, estimate bathroom starts at ~60% of typical container
    const estimatedBathroomTop = 530; // 60% of ~880px
    
    for (let i = 0; i < 3; i++) {
      const x = bathroomBounds.minX + Math.random() * (bathroomBounds.maxX - bathroomBounds.minX - blockSize);
      const y = estimatedBathroomTop + bathroomBounds.minY + Math.random() * (bathroomBounds.maxY - bathroomBounds.minY - blockSize);
      newBlocks.push({
        id: blockId++,
        x,
        y,
        visible: true,
        hiddenIn: null,
        hiddenDisplayPos: null
      });
    }
    
    // Toybox: 5 blocks (hidden)
    for (let i = 0; i < 5; i++) {
      newBlocks.push({
        id: blockId++,
        x: 0,
        y: 0,
        visible: false,
        hiddenIn: 'toybox',
        hiddenDisplayPos: { x: 10 + (i % 3) * 35, y: 10 + Math.floor(i / 3) * 35 }
      });
    }
    
    // Rug: 4 blocks (hidden)
    for (let i = 0; i < 4; i++) {
      newBlocks.push({
        id: blockId++,
        x: 0,
        y: 0,
        visible: false,
        hiddenIn: 'rug',
        hiddenDisplayPos: { x: 10 + (i % 2) * 40, y: 5 + Math.floor(i / 2) * 25 }
      });
    }
    
    // Garden: 2 blocks (hidden in garden, visible when window is opened)
    for (let i = 0; i < 2; i++) {
      newBlocks.push({
        id: blockId++,
        x: 0,
        y: 0,
        visible: false,
        hiddenIn: 'garden',
        hiddenDisplayPos: { x: 20 + i * 40, y: 30 }
      });
    }
    
    // Bathtub: 8 blocks (hidden)
    for (let i = 0; i < 8; i++) {
      newBlocks.push({
        id: blockId++,
        x: 0,
        y: 0,
        visible: false,
        hiddenIn: 'bathtub',
        hiddenDisplayPos: { x: 5 + (i % 4) * 30, y: 60 + Math.floor(i / 4) * 25 }
      });
    }
    
    setBlocks(newBlocks);
    setToyboxPos({ x: 20, y: 40 });
    setToyboxOpen(false); // Closed
    setBathtubPos({ x: 235, y: 125 });
    setScalePos({ x: 540, y: 160 });
    setRulerPos({ x: 540, y: 60 });
    setRugPos({ x: 240, y: 210 });
    setRugFolded(false); // Unfolded
    setWindowOpen(false); // Closed
    setLivingRoomDoorOpen(false); // Locked
    setBathroomDoorOpen(false); // Locked
    setMomMode(true); // Mom mode ON
    setMeasurements([]);
    setShowCalculator(false);
    setCalculatorFormula([]);
    setCalculatorOutputType('toybox');
    setCalculatorCustomName('');
    setCalculatorCustomUnit('blocks');
    setCalculatorLastResult(null);
    setCalculatorResults({ toybox: null, bathtub: null, total: null });
    
    setGameStarted(true);
  };

  const visibleBlocks = blocks.filter(b => b.visible).length;
  const toyboxBlocks = blocks.filter(b => b.hiddenIn === 'toybox').length;
  const bathtubBlocks = blocks.filter(b => b.hiddenIn === 'bathtub').length;
  const rugBlocks = blocks.filter(b => b.hiddenIn === 'rug').length;
  const gardenBlocks = blocks.filter(b => b.hiddenIn === 'garden').length;
  
  // Compute visible blocks per room based on position
  // We'll compute this dynamically in the render since we need DOM measurements
  // For now, use a ref-based approach that updates on render
  const getVisibleBlocksByRoom = () => {
    const roomContainer = document.querySelector('[data-room-container]');
    const livingRoom = document.querySelector('[data-room="living"]');
    const bathroom = document.querySelector('[data-room="bathroom"]');
    
    if (!roomContainer || !livingRoom || !bathroom) {
      return { livingRoom: 0, bathroom: 0 };
    }
    
    const containerRect = roomContainer.getBoundingClientRect();
    const livingRect = livingRoom.getBoundingClientRect();
    const bathroomRect = bathroom.getBoundingClientRect();
    
    const livingRoomEnd = livingRect.bottom - containerRect.top;
    const bathroomStart = bathroomRect.top - containerRect.top;
    
    let livingRoomCount = 0;
    let bathroomCount = 0;
    
    blocks.filter(b => b.visible).forEach(block => {
      const blockCenterY = block.y + 25;
      if (blockCenterY < livingRoomEnd) {
        livingRoomCount++;
      } else if (blockCenterY > bathroomStart) {
        bathroomCount++;
      }
      // Blocks in corridor are not counted in either
    });
    
    return { livingRoom: livingRoomCount, bathroom: bathroomCount };
  };
  
  const [roomBlockCounts, setRoomBlockCounts] = useState({ livingRoom: 0, bathroom: 0 });
  
  // Update room block counts when blocks change
  useEffect(() => {
    if (!playgroundStarted && !gameStarted) return;
    const counts = getVisibleBlocksByRoom();
    setRoomBlockCounts(counts);
  }, [blocks, playgroundStarted, gameStarted]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#111827', fontFamily: 'system-ui, sans-serif' }}>
      {/* Fullscreen notice - only shows on smaller screens */}
      <style>{`
        @media (min-width: 1024px) {
          .fullscreen-notice { display: none !important; }
        }
      `}</style>
      <div className="fullscreen-notice" style={{
        backgroundColor: '#78350f',
        padding: '8px 16px',
        textAlign: 'center'
      }}>
        <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
          USE FULLSCREEN MODE FOR BEST EXPERIENCE
        </span>
      </div>

      {/* Header - hidden on home page */}
      {mode !== 'home' && (
      <div style={{ backgroundColor: '#111827', borderBottom: '1px solid #374151', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMode('home')}
            style={{
              padding: '8px 12px',
              fontSize: '18px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
            title="Home"
          >
            🏠
          </button>
          {mode === 'playground' && playgroundStarted && (
            <button
              onClick={() => setPlaygroundStarted(false)}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                border: '2px solid #ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff'
              }}
            >
              ← Back to Playground Instructions
            </button>
          )}
          {mode === 'game' && gameStarted && (
            <button
              onClick={() => setGameStarted(false)}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                border: '2px solid #ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff'
              }}
            >
              ← Back to Game Instructions
            </button>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e5e7eb', marginBottom: '8px' }}>Feynman's Conservation of Energy</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setMode('plot');
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: mode === 'plot' ? '#8b5cf6' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Plot
            </button>
            <button
              onClick={() => {
                setMode('playground');
                setPlaygroundStarted(false);
                reset();
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: mode === 'playground' ? '#8b5cf6' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Playground
            </button>
            <button
              onClick={() => {
                setMode('game');
                setGameStarted(false);
                setGameInitialized(false);
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: mode === 'game' ? '#8b5cf6' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Game
            </button>
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
      )}

      {mode === 'home' ? (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', gap: '32px', padding: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#e5e7eb', textAlign: 'center' }}>Feynman's Conservation of Energy</h1>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setMode('plot')}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Plot
            </button>
            <button
              onClick={() => {
                setMode('playground');
                setPlaygroundStarted(false);
              }}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Playground
            </button>
            <button
              onClick={() => {
                setMode('game');
                setGameStarted(false);
                setGameInitialized(false);
              }}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Game
            </button>
          </div>

          <p style={{ fontSize: '18px', color: '#9ca3af', textAlign: 'center', maxWidth: '600px', lineHeight: '1.6' }}>
            A snippet of Feynman's Lectures brought to life via an interactive simulation featuring a Playground and Game along with original verbatim text as a Plot
          </p>
        </div>
      ) : mode === 'plot' ? (
        <div style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#111827',
          padding: '40px',
          overflowY: 'auto',
          scrollbarWidth: 'thick',
          scrollbarColor: '#6b7280 #1f2937'
        }} className="plot-scrollbar">
          <style>{`
            .plot-scrollbar::-webkit-scrollbar {
              width: 50px;
            }
            .plot-scrollbar::-webkit-scrollbar-track {
              background: #374151;
              border-radius: 25px;
            }
            .plot-scrollbar::-webkit-scrollbar-thumb {
              background: #9ca3af;
              border-radius: 25px;
              border: 8px solid #374151;
            }
            .plot-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #d1d5db;
            }
          `}</style>
          <h2 style={{ fontSize: '48px', color: '#e5e7eb', marginBottom: '8px' }}>Plot</h2>
          <p style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
            taken <em style={{ fontStyle: 'italic' }}>verbatim</em> from the Feynman Lectures, Vol I, Chp 4, Sec 4-1, "What is Energy?"
          </p>

          <div style={{ maxWidth: '800px', textAlign: 'left', color: '#e5e7eb', lineHeight: '1.8', fontSize: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              There is a fact, or if you wish, a law, governing all natural phenomena that are known to date. There is no known exception to this law—it is exact so far as we know. The law is called the conservation of energy. It states that there is a certain quantity, which we call energy, that does not change in the manifold changes which nature undergoes. That is a most abstract idea, because it is a mathematical principle; it says that there is a numerical quantity which does not change when something happens. It is not a description of a mechanism, or anything concrete; it is just a strange fact that we can calculate some number and when we finish watching nature go through her tricks and calculate the number again, it is the same. (Something like the bishop on a red square, and after a number of moves—details unknown—it is still on some red square. It is a law of this nature.) Since it is an abstract idea, we shall illustrate the meaning of it by an analogy.
            </p>
            
            <p style={{ marginBottom: '16px' }}>
              Imagine a child, perhaps "Dennis the Menace," who has blocks which are absolutely indestructible, and cannot be divided into pieces. Each is the same as the other. Let us suppose that he has 28 blocks. His mother puts him with his 28 blocks into a room at the beginning of the day. At the end of the day, being curious, she counts the blocks very carefully, and discovers a phenomenal law—no matter what he does with the blocks, there are always 28 remaining! This continues for a number of days, until one day there are only 27 blocks, but a little investigating shows that there is one under the rug—she must look everywhere to be sure that the number of blocks has not changed. One day, however, the number appears to change—there are only 26 blocks. Careful investigation indicates that the window was open, and upon looking outside, the other two blocks are found. Another day, careful count indicates that there are 30 blocks! This causes considerable consternation, until it is realized that Bruce came to visit, bringing his blocks with him, and he left a few at Dennis' house. After she has disposed of the extra blocks, she closes the window, does not let Bruce in, and then everything is going along all right, until one time she counts and finds only 25 blocks. However, there is a box in the room, a toy box, and the mother goes to open the toy box, but the boy says "No, do not open my toy box," and screams. Mother is not allowed to open the toy box. Being extremely curious, and somewhat ingenious, she invents a scheme! She knows that a block weighs three ounces, so she weighs the box at a time when she sees 28 blocks, and it weighs 16 ounces. The next time she wishes to check, she weighs the box again, subtracts sixteen ounces and divides by three. She discovers the following:
            </p>
            
            <div style={{
              backgroundColor: '#1e3a5f',
              padding: '16px 24px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontFamily: 'serif',
              fontSize: '18px',
              textAlign: 'center',
              border: '2px solid #3b82f6',
              color: '#ffffff'
            }}>
              (number of blocks seen) + (weight of box − 16 ounces) / 3 ounces = constant. <span style={{ color: '#93c5fd' }}>(4.1)</span>
            </div>
            
            <p style={{ marginBottom: '16px' }}>
              There then appear to be some new deviations, but careful study indicates that the dirty water in the bathtub is changing its level. The child is throwing blocks into the water, and she cannot see them because it is so dirty, but she can find out how many blocks are in the water by adding another term to her formula. Since the original height of the water was 6 inches and each block raises the water a quarter of an inch, this new formula would be:
            </p>
            
            <div style={{
              backgroundColor: '#1e3a5f',
              padding: '16px 24px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontFamily: 'serif',
              fontSize: '18px',
              textAlign: 'center',
              border: '2px solid #3b82f6',
              color: '#ffffff'
            }}>
              (number of blocks seen) + (weight of box − 16 ounces) / 3 ounces + (height of water − 6 inches) / ¼ inch = constant. <span style={{ color: '#93c5fd' }}>(4.2)</span>
            </div>
            
            <p style={{ marginBottom: '16px' }}>
              In the gradual increase in the complexity of her world, she finds a whole series of terms representing ways of calculating how many blocks are in places where she is not allowed to look. As a result, she finds a complex formula, a quantity which has to be computed, which always stays the same in her situation.
            </p>
            
            <p style={{ marginBottom: '16px' }}>
              What is the analogy of this to the conservation of energy? The most remarkable aspect that must be abstracted from this picture is that there are no blocks. Take away the first terms in (4.1) and (4.2) and we find ourselves calculating more or less abstract things. The analogy has the following points. First, when we are calculating the energy, sometimes some of it leaves the system and goes away, or sometimes some comes in. In order to verify the conservation of energy, we must be careful that we have not put any in or taken any out. Second, the energy has a large number of different forms, and there is a formula for each one. These are: gravitational energy, kinetic energy, heat energy, elastic energy, electrical energy, chemical energy, radiant energy, nuclear energy, mass energy. If we total up the formulas for each of these contributions, it will not change except for energy going in and out.
            </p>
            
            <p style={{ marginBottom: '16px' }}>
              It is important to realize that in physics today, we have no knowledge of what energy is. We do not have a picture that energy comes in little blobs of a definite amount. It is not that way. However, there are formulas for calculating some numerical quantity, and when we add it all together it gives "28"—always the same number. It is an abstract thing in that it does not tell us the mechanism or the reasons for the various formulas.
            </p>
          </div>
        </div>
      ) : mode === 'game' && !gameStarted ? (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', gap: '24px', padding: '40px' }}>
          <h2 style={{ fontSize: '48px', color: '#e5e7eb', marginBottom: '8px' }}>Game</h2>

          <div style={{ maxWidth: '700px', textAlign: 'left', color: '#e5e7eb', lineHeight: '1.7', fontSize: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              This game revolves around a hypothetical Law of Conservation of Blocks which states:
            </p>
            
            <blockquote style={{
              borderLeft: '4px solid #8b5cf6',
              paddingLeft: '16px',
              marginLeft: '0',
              marginBottom: '16px',
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#ffffff'
            }}>
              The total number of blocks is always 28.
            </blockquote>

            <p style={{ marginBottom: '16px' }}>
              Dennis the Menace, a naughty child, has cleverly hidden many of the blocks.
            </p>

            <p style={{ marginBottom: '16px' }}>
              Some blocks are <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>observable</em>—visible on the floor, hiding in plain sight under a foldable rug, or waiting just beyond the window in the garden.
            </p>

            <p style={{ marginBottom: '16px' }}>
              Other blocks must be <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>inferred</em> indirectly. The toy box is locked, but it sits on a scale. The bathtub is opaque, but the water level rises. To find these hidden blocks, you'll need to take <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>measurements</em> and build simple <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>mathematical models</em>.
            </p>

            <p style={{ marginBottom: '16px' }}>
              Your tools: digital room sensors, a weighing scale, a ruler, a measurement log, and a very restrictive calculator (no direct number entry—only your saved measurements).
            </p>

            <p style={{ marginBottom: '24px' }}>
              Take measurements. Record them. Deduce the hidden quantities.
            </p>

            <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#ffffff', textAlign: 'center' }}>
              Can you prove that the total number of blocks is 28?
            </p>
          </div>
          
          <button
            onClick={() => {
              if (!gameInitialized) {
                initializeGame();
                setGameInitialized(true);
              } else {
                setGameStarted(true);
              }
            }}
            style={{
              position: 'relative',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              overflow: 'hidden',
              isolation: 'isolate',
              marginTop: '8px'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Proceed to game</span>
            <style>{`
              @keyframes glowingBorder {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
            <div style={{
              position: 'absolute',
              inset: 0,
              padding: '2px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #22c55e, #eab308, #ef4444, #8b5cf6)',
              backgroundSize: '300% 100%',
              animation: 'glowingBorder 3s linear infinite',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              zIndex: 0
            }} />
          </button>
        </div>
      ) : (mode === 'playground' && !playgroundStarted) ? (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', gap: '24px', padding: '40px' }}>
          <h2 style={{ fontSize: '48px', color: '#e5e7eb', marginBottom: '8px' }}>Playground</h2>

          <div style={{ maxWidth: '700px', textAlign: 'left', color: '#e5e7eb', lineHeight: '1.7', fontSize: '16px' }}>
            <p style={{ marginBottom: '16px', fontWeight: '500' }}>
              Use the Playground to familiarize yourself with the interactive elements of the simulation so you'll know your way around while playing the game!
            </p>
            
            <p style={{ marginBottom: '16px' }}>
              First, imagine you are Dennis the Menace. Hide blocks under the rug and toss some over the fence into the garden. Open the toy box, stuff some blocks inside, and lock it up. Carry a handful of blocks into the bathroom—leave some on the floor and toss a few into the tub!
            </p>
            
            <p style={{ marginBottom: '16px' }}>
              Now it's time to role-play "the Mom"... she is obsessed with the Law of Conservation of Blocks which states:
            </p>
            
            <blockquote style={{
              borderLeft: '4px solid #8b5cf6',
              paddingLeft: '16px',
              marginLeft: '0',
              marginBottom: '16px',
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#ffffff'
            }}>
              The total number of blocks is always 28.
            </blockquote>

            <p style={{ marginBottom: '16px' }}>
              Some blocks are <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>observable</em>—visible on the floor, hiding in plain sight under a foldable rug, or waiting just beyond the window in the garden.
            </p>

            <p style={{ marginBottom: '16px' }}>
              Other blocks must be <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>inferred</em> indirectly. The toy box is locked, but it sits on a scale. The bathtub is opaque, but the water level rises. To find these hidden blocks, you'll need to take <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>measurements</em> and build simple <em style={{ color: '#a78bfa', fontStyle: 'italic' }}>mathematical models</em>.
            </p>

            <p style={{ marginBottom: '16px' }}>
              Your tools: digital room sensors, a weighing scale, a ruler, a measurement log, and a very restrictive calculator (no direct number entry—only your saved measurements).
            </p>

            <p style={{ marginBottom: '24px' }}>
              Play with the system. Take measurements. Record them. Deduce the hidden quantities.
            </p>

            <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#ffffff', textAlign: 'center' }}>
              Can you prove that the total number of blocks is 28?
            </p>
          </div>

          <button
            onClick={() => setPlaygroundStarted(true)}
            style={{
              position: 'relative',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              overflow: 'hidden',
              isolation: 'isolate',
              marginTop: '8px'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Proceed to playground</span>
            <style>{`
              @keyframes glowingBorder {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
            <div style={{
              position: 'absolute',
              inset: 0,
              padding: '2px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #22c55e, #eab308, #ef4444, #8b5cf6)',
              backgroundSize: '300% 100%',
              animation: 'glowingBorder 3s linear infinite',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              zIndex: 0
            }} />
          </button>
        </div>
      ) : (
      <div style={{ display: 'flex', flex: 1, gap: '12px', padding: '12px', minHeight: 0 }}>
        {/* Room Container */}
        <div data-room-container style={{ flex: 2, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          {/* Living Room - 40% */}
          <div 
            data-room="living"
            style={{
              position: 'relative',
              flex: '0 0 40%',
              backgroundColor: livingRoomDoorOpen ? '#fef3c7' : '#1f2937',
              backgroundImage: livingRoomDoorOpen 
                ? 'repeating-linear-gradient(90deg, #fde68a 0px, #fde68a 1px, transparent 1px, transparent 30px), repeating-linear-gradient(0deg, #fde68a 0px, #fde68a 1px, transparent 1px, transparent 30px)'
                : 'repeating-linear-gradient(90deg, #374151 0px, #374151 1px, transparent 1px, transparent 30px), repeating-linear-gradient(0deg, #374151 0px, #374151 1px, transparent 1px, transparent 30px)',
              borderBottom: '4px solid #92400e',
              padding: '8px',
              transition: 'background-color 0.3s ease'
            }}
          >
            {livingRoomDoorOpen && (
              <div style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '18px', fontWeight: 'bold', color: '#92400e', backgroundColor: '#fef3c7', padding: '4px 10px', borderRadius: '6px' }}>🛋️ Living Room</div>
            )}
            {!livingRoomDoorOpen && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '16px', fontWeight: 'bold', color: '#6b7280' }}>🔒 Door Closed</div>
            )}
            
            {/* All living room contents - only visible when door is open */}
            {livingRoomDoorOpen && (
            <>
            {/* Garden area - top right corner */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 180,
                height: 140,
                zIndex: 3
              }}
              onMouseEnter={() => setWindowHovered(true)}
              onMouseLeave={() => setWindowHovered(false)}
            >
              {/* Hover tooltip - positioned within the hover container */}
              {windowHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: 55,
                    left: 5,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    zIndex: 100,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setWindowOpen(!windowOpen);
                  }}
                >
                  {windowOpen ? '🚪 Close window' : '🪟 Open window'}
                </div>
              )}

              {/* Garden interior */}
              <div
                data-garden
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 120,
                  height: 120,
                  backgroundColor: windowOpen ? '#166534' : '#1f2937',
                  backgroundImage: windowOpen 
                    ? 'repeating-linear-gradient(90deg, #15803d 0px, #15803d 1px, transparent 1px, transparent 15px), repeating-linear-gradient(0deg, #15803d 0px, #15803d 1px, transparent 1px, transparent 15px)'
                    : 'repeating-linear-gradient(90deg, #374151 0px, #374151 1px, transparent 1px, transparent 15px), repeating-linear-gradient(0deg, #374151 0px, #374151 1px, transparent 1px, transparent 15px)',
                  borderLeft: '6px solid #78716c',
                  borderBottom: '6px solid #78716c',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {/* Garden label */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '8px', 
                  right: '8px', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  color: windowOpen ? '#bbf7d0' : '#6b7280',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}>
                  🌿 Garden
                </div>
                
                {/* Show blocks when window is open */}
                {windowOpen && gardenBlocks > 0 && (() => {
                  const blockSize = 24;
                  const gardenBlocksList = blocks.filter(b => b.hiddenIn === 'garden');
                  
                  return (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}>
                      {gardenBlocksList.map((block) => {
                        const pos = block.hiddenDisplayPos || { x: 10, y: 10 };
                        return (
                          <div
                            key={block.id}
                            style={{
                              position: 'absolute',
                              left: pos.x,
                              top: pos.y,
                              width: `${blockSize}px`,
                              height: `${blockSize}px`,
                              backgroundColor: '#fbbf24',
                              border: '2px solid #f59e0b',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              pointerEvents: 'auto'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              retrieveBlock('garden');
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
              
              {/* Window on the vertical wall */}
              <div
                data-window
                style={{
                  position: 'absolute',
                  top: 30,
                  right: 117,
                  width: 20,
                  height: 50,
                  backgroundColor: windowOpen ? '#87CEEB' : '#4a5568',
                  border: '3px solid #78716c',
                  borderRadius: '2px',
                  transition: 'background-color 0.3s ease',
                  boxShadow: windowOpen ? 'inset 0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              >
                {/* Window panes */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#78716c'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#78716c'
                }} />
              </div>
            </div>
            
            {/* Toybox - with lock mechanism */}
            <div
              style={{
                position: 'absolute',
                left: toyboxPos.x,
                top: toyboxPos.y - 40,
                width: 130,
                height: 150,
                zIndex: 5
              }}
              onMouseEnter={() => setToyboxHovered(true)}
              onMouseLeave={() => setToyboxHovered(false)}
            >
              {/* Hover tooltip - positioned ABOVE the lock */}
              {toyboxHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: 5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mode !== 'game') {
                      setToyboxOpen(!toyboxOpen);
                    }
                  }}
                >
                  {mode === 'game' ? '🔒 Locked' : (toyboxOpen ? '🔓 Close box' : '🔒 Open box')}
                </div>
              )}
              
              {/* The actual toybox */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 40,
                  width: 130,
                  height: 110,
                  backgroundColor: '#8B4513',
                  borderRadius: '10px',
                  border: '4px solid #654321',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: dragging?.type === 'toybox' ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                  overflow: 'hidden'
                }}
                onMouseDown={(e) => handleMouseDown(e, 'toybox', null, 'living')}
                onClick={() => {
                  if (!dragging && toyboxOpen) {
                    retrieveBlock('toybox');
                  }
                }}
              >
                {/* Open lid indicator at top */}
                {toyboxOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '20px',
                    backgroundColor: '#654321',
                    borderBottom: '2px solid #4a3520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ 
                      width: '80%', 
                      height: '4px', 
                      backgroundColor: '#1f2937',
                      borderRadius: '2px'
                    }} />
                  </div>
                )}
                
                <span style={{ fontSize: '40px' }}>📦</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>Toy Box</span>
                
                {/* Lock indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  fontSize: '16px'
                }}>
                  {toyboxOpen ? '🔓' : '🔒'}
                </div>
              </div>
            </div>

            {/* Weighing Scale - draggable, layout matches Digital Ruler */}
            <div 
              style={{ 
                position: 'absolute', 
                left: scalePos.x,
                top: scalePos.y, 
                userSelect: 'none', 
                zIndex: 4,
                cursor: 'grab'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const scaleEl = e.currentTarget;
                const rect = scaleEl.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                
                const onMouseMove = (moveE) => {
                  const livingRoom = document.querySelector('[data-room="living"]');
                  if (!livingRoom) return;
                  const livingRect = livingRoom.getBoundingClientRect();
                  const newX = moveE.clientX - livingRect.left - offsetX;
                  const newY = moveE.clientY - livingRect.top - offsetY;
                  setScalePos({
                    x: Math.max(0, Math.min(newX, livingRect.width - 100)),
                    y: Math.max(30, Math.min(newY, livingRect.height - 150))
                  });
                };
                
                const onMouseUp = () => {
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Digital Display - top (matches ruler) */}
                <div style={{ 
                  width: 90, 
                  height: 48, 
                  backgroundColor: '#1f2937', 
                  borderRadius: '8px 8px 0 0', 
                  border: '3px solid #22c55e',
                  borderBottom: 'none',
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 -2px 4px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>
                    {scaleWeight.toFixed(2)}
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }}>OUNCES</div>
                </div>
                
                {/* Scale Save Dialog - matches ruler dialog exactly */}
                {showScaleSaveDialog && (
                  <div 
                    style={{
                      position: 'fixed',
                      top: scaleDialogPos?.y ?? '50%',
                      left: scaleDialogPos?.x ?? '50%',
                      transform: scaleDialogPos ? 'none' : 'translate(-50%, -50%)',
                      width: '350px',
                      backgroundColor: 'white',
                      border: '3px solid #22c55e',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {/* Draggable Header */}
                    <div 
                      style={{ 
                        backgroundColor: '#1f2937',
                        padding: '12px 24px',
                        cursor: 'move',
                        userSelect: 'none'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const dialog = e.target.closest('div[style*="position: fixed"]');
                        const rect = dialog.getBoundingClientRect();
                        const offsetX = e.clientX - rect.left;
                        const offsetY = e.clientY - rect.top;
                        
                        const onMouseMove = (moveE) => {
                          setScaleDialogPos({
                            x: moveE.clientX - offsetX,
                            y: moveE.clientY - offsetY
                          });
                        };
                        
                        const onMouseUp = () => {
                          document.removeEventListener('mousemove', onMouseMove);
                          document.removeEventListener('mouseup', onMouseUp);
                        };
                        
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'white', textAlign: 'center' }}>💾 Save Measurement</div>
                    </div>
                    
                    {/* Dialog Content */}
                    <div style={{ padding: '24px' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>Measurement Name</label>
                        <input
                          type="text"
                          placeholder="Enter a name for this measurement..."
                          value={scaleSaveName}
                          onChange={(e) => setScaleSaveName(e.target.value)}
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            border: '2px solid #d1d5db',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: '#16a34a', 
                        marginBottom: '20px', 
                        textAlign: 'center',
                        backgroundColor: '#f0fdf4',
                        padding: '16px',
                        borderRadius: '8px'
                      }}>
                        {scaleWeight.toFixed(2)} ounces
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => {
                            const defaultName = `Scale mnt ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
                            saveMeasurement(scaleWeight, scaleSaveName || defaultName, 'oz');
                            setScaleSaveName('');
                            setShowScaleSaveDialog(false);
                            setScaleDialogPos(null);
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: '#22c55e',
                            color: 'white',
                            fontSize: '16px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setScaleSaveName('');
                            setShowScaleSaveDialog(false);
                            setScaleDialogPos(null);
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: '#6b7280',
                            color: 'white',
                            fontSize: '16px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Scale Platform Body - where weights are placed */}
                <div style={{
                  width: 90,
                  height: 100,
                  backgroundColor: '#d1d5db',
                  border: '3px solid #22c55e',
                  borderTop: 'none',
                  borderBottom: 'none',
                  position: 'relative',
                  boxShadow: '3px 0 8px rgba(0,0,0,0.2)'
                }}>
                </div>
                
                {/* SAVE Button - at bottom (matches ruler exactly) */}
                <div 
                  style={{
                    width: 90,
                    height: 40,
                    backgroundColor: '#1f2937',
                    borderRadius: '0 0 8px 8px',
                    border: '3px solid #22c55e',
                    borderTop: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: scaleWeight > 0 ? 'pointer' : 'default',
                    opacity: scaleWeight > 0 ? 1 : 0.5
                  }}
                  onClick={() => {
                    if (scaleWeight > 0) {
                      setShowScaleSaveDialog(true);
                    }
                  }}
                >
                  <div style={{ fontSize: '16px' }}>💾</div>
                  <div style={{ color: '#ffffff', fontSize: '8px', fontWeight: 'bold' }}>SAVE</div>
                </div>
              </div>
            </div>

            {/* Blue Rug - wrapper div for hover area including tooltip */}
            <div
              style={{
                position: 'absolute',
                left: rugPos.x,
                top: rugPos.y - 40,
                width: 140,
                height: rugFolded ? 85 + 40 : 130 + 40,
                zIndex: 6,
              }}
              onMouseEnter={() => setRugHovered(true)}
              onMouseLeave={() => setRugHovered(false)}
            >
              {/* Hover tooltip - at top of wrapper */}
              {rugHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    zIndex: 100,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRugFolded(!rugFolded);
                  }}
                >
                  {rugFolded ? '👆 Unfold the rug' : '👀 Look under rug'}
                </div>
              )}

              {/* The actual rug */}
              <div
                data-rug
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 40,
                  width: 140,
                  height: rugFolded ? 45 : 90,
                  backgroundColor: rugFolded ? '#1e40af' : '#3b82f6',
                  borderRadius: rugFolded ? '8px 8px 20px 20px' : '12px',
                  border: '3px solid #1e3a8a',
                  cursor: dragging?.type === 'rug' ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                  transition: 'height 0.3s ease, background-color 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'visible'
                }}
                onMouseDown={(e) => handleMouseDown(e, 'rug', null, 'living')}
                onClick={() => {
                  if (rugFolded && rugBlocks > 0 && !dragging) {
                    retrieveBlock('rug');
                  }
                }}
              >
                {/* Rug pattern */}
                {!rugFolded && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      right: '10px',
                      bottom: '10px',
                      border: '2px solid #60a5fa',
                      borderRadius: '8px',
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#1e40af',
                      borderRadius: '50%',
                      pointerEvents: 'none'
                    }} />
                  </>
                )}
                
                {/* Bulges when blocks are hidden (only visible when unfolded) */}
                {!rugFolded && rugBlocks > 0 && (() => {
                  const bulgeSize = 25;
                  const rugBlocksList = blocks.filter(b => b.hiddenIn === 'rug');
                  
                  return (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}>
                      {rugBlocksList.map((block) => {
                        const pos = block.hiddenDisplayPos || { x: 20, y: 20 };
                        return (
                          <div
                            key={block.id}
                            style={{
                              position: 'absolute',
                              left: pos.x,
                              top: pos.y,
                              width: `${bulgeSize}px`,
                              height: `${bulgeSize}px`,
                              backgroundColor: '#2563eb',
                              borderRadius: '50%',
                              boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.2)',
                              border: '1px solid #1d4ed8'
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Label - above the rug */}
                <span style={{ 
                  position: 'absolute',
                  bottom: '100%',
                  marginBottom: '5px',
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#1e3a8a', 
                  textShadow: '1px 1px 2px rgba(255,255,255,0.7)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap'
                }}>
                  🧹 Rug
                </span>
              </div>

              {/* Show hidden blocks when folded - same style as garden */}
              {rugFolded && rugBlocks > 0 && (() => {
                const blockSize = 24;
                const rugBlocksList = blocks.filter(b => b.hiddenIn === 'rug');
                
                return (
                  <div style={{
                    position: 'absolute',
                    top: 90,
                    left: 0,
                    width: 140,
                    height: 100,
                    pointerEvents: 'none'
                  }}>
                    {rugBlocksList.map((block) => {
                      const pos = block.hiddenDisplayPos || { x: 20, y: 20 };
                      return (
                        <div
                          key={block.id}
                          style={{
                            position: 'absolute',
                            left: pos.x,
                            top: pos.y,
                            width: `${blockSize}px`,
                            height: `${blockSize}px`,
                            backgroundColor: '#fbbf24',
                            border: '2px solid #f59e0b',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            pointerEvents: 'auto'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            retrieveBlock('rug');
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            </>
            )}
          </div>

          {/* Corridor - 20% */}
          <div 
            data-room="corridor"
            style={{
              position: 'relative',
              flex: '0 0 20%',
              backgroundColor: '#d6d3d1',
              backgroundImage: 'repeating-linear-gradient(90deg, #a8a29e 0px, #a8a29e 2px, transparent 2px, transparent 40px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '4px solid #78716c',
              borderBottom: '4px solid #78716c'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#57534e', backgroundColor: '#e7e5e4', padding: '6px 16px', borderRadius: '6px' }}>
              🚪 Corridor
            </div>
            
            {/* Top door area - Living Room door - follows garden window blueprint */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 40
              }}
              onMouseEnter={() => setLivingRoomDoorHovered(true)}
              onMouseLeave={() => setLivingRoomDoorHovered(false)}
            >
              {/* Door indicator - like the window pane */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 50,
                  height: 20,
                  backgroundColor: livingRoomDoorOpen ? '#87CEEB' : '#4a5568',
                  border: '3px solid #78716c',
                  borderRadius: '0 0 4px 4px',
                  borderTop: 'none',
                  transition: 'background-color 0.3s ease',
                  boxShadow: livingRoomDoorOpen ? 'inset 0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              />
              
              {/* Hover tooltip - positioned BELOW the door */}
              {livingRoomDoorHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: 25,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLivingRoomDoorOpen(!livingRoomDoorOpen);
                  }}
                >
                  {livingRoomDoorOpen ? '🚪 Close door' : '🚪 Open door'}
                </div>
              )}
            </div>
            
            {/* Bottom door area - Bathroom door - follows garden window blueprint */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 40
              }}
              onMouseEnter={() => setBathroomDoorHovered(true)}
              onMouseLeave={() => setBathroomDoorHovered(false)}
            >
              {/* Door indicator - like the window pane */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 50,
                  height: 20,
                  backgroundColor: bathroomDoorOpen ? '#87CEEB' : '#4a5568',
                  border: '3px solid #78716c',
                  borderRadius: '4px 4px 0 0',
                  borderBottom: 'none',
                  transition: 'background-color 0.3s ease',
                  boxShadow: bathroomDoorOpen ? 'inset 0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              />
              
              {/* Hover tooltip - positioned ABOVE the door */}
              {bathroomDoorHovered && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 25,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBathroomDoorOpen(!bathroomDoorOpen);
                  }}
                >
                  {bathroomDoorOpen ? '🚪 Close door' : '🚪 Open door'}
                </div>
              )}
            </div>
          </div>

          {/* Bathroom - 40% */}
          <div 
            data-room="bathroom"
            style={{
              position: 'relative',
              flex: '0 0 40%',
              backgroundColor: bathroomDoorOpen ? '#e0f2fe' : '#1f2937',
              backgroundImage: bathroomDoorOpen 
                ? 'repeating-linear-gradient(90deg, #bae6fd 0px, #bae6fd 1px, transparent 1px, transparent 30px), repeating-linear-gradient(0deg, #bae6fd 0px, #bae6fd 1px, transparent 1px, transparent 30px)'
                : 'repeating-linear-gradient(90deg, #374151 0px, #374151 1px, transparent 1px, transparent 30px), repeating-linear-gradient(0deg, #374151 0px, #374151 1px, transparent 1px, transparent 30px)',
              borderTop: '4px solid #0369a1',
              padding: '8px',
              transition: 'background-color 0.3s ease'
            }}
          >
            {bathroomDoorOpen && (
              <div style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '18px', fontWeight: 'bold', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '4px 10px', borderRadius: '6px' }}>🚿 Bathroom</div>
            )}
            {!bathroomDoorOpen && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '16px', fontWeight: 'bold', color: '#6b7280' }}>🔒 Door Closed</div>
            )}
            
            {/* Bathtub - fixed position */}
            {bathroomDoorOpen && (
            <div
              data-bathtub
              style={{
                position: 'absolute',
                left: bathtubPos.x - 110,
                top: bathtubPos.y - 70,
                width: 380,
                height: 240,
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '5px solid #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                overflow: 'visible',
                zIndex: 5,
                boxShadow: '3px 3px 10px rgba(0,0,0,0.2)'
              }}
              onClick={() => retrieveBlock('bathtub')}
            >
              {/* Water - simple level display, no overflow */}
              {(() => {
                const waterLevel = BATHTUB_BASE_LEVEL + bathtubBlocks * BLOCK_LEVEL_INCREASE;
                const displayLevel = Math.min(waterLevel, 9);
                return (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    overflow: 'hidden',
                    borderRadius: '12px'
                  }}>
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${(displayLevel / 9) * 100}%`,
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        transition: 'height 0.3s ease'
                      }}
                    />
                  </div>
                );
              })()}
              {/* Bathtub label - outside on the left */}
              <div style={{
                position: 'absolute',
                left: '-90px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '48px' }}>🛁</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155' }}>Bathtub</span>
              </div>
              
              {/* Mom/Dennis toggle - bottom right */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-35px',
                  right: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: momMode ? '#fef2f2' : '#f0fdf4',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: `2px solid ${momMode ? '#fca5a5' : '#86efac'}`,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.2s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (mode !== 'game') {
                    setMomMode(!momMode);
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{momMode ? '👩' : '👦'}</span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  color: momMode ? '#dc2626' : '#16a34a' 
                }}>
                  {mode === 'game' ? 'Mom (locked)' : (momMode ? 'Mom' : 'Dennis')}
                </span>
              </div>
            </div>
            )}

            {/* Digital Ruler - draggable */}
            {bathroomDoorOpen && (() => {
              const rulerHeight = 230; // Match bathtub visual height (bathtub is 240px with borders)
              const maxInches = 9; // Bathtub height is 9 inches
              const pixelsPerInch = rulerHeight / maxInches;
              const currentLevel = waterLevel > 0 ? waterLevel : 0;
              const litHeight = (currentLevel / 9) * rulerHeight;
              
              return (
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: rulerPos.x,
                    top: rulerPos.y, 
                    userSelect: 'none', 
                    zIndex: 6,
                    cursor: 'grab'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rulerEl = e.currentTarget;
                    const rect = rulerEl.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left;
                    const offsetY = e.clientY - rect.top;
                    
                    const onMouseMove = (moveE) => {
                      const bathroom = document.querySelector('[data-room="bathroom"]');
                      if (!bathroom) return;
                      const bathroomRect = bathroom.getBoundingClientRect();
                      const newX = moveE.clientX - bathroomRect.left - offsetX;
                      const newY = moveE.clientY - bathroomRect.top - offsetY;
                      setRulerPos({
                        x: Math.max(0, Math.min(newX, bathroomRect.width - 70)),
                        y: Math.max(0, Math.min(newY, bathroomRect.height - 160))
                      });
                    };
                    
                    const onMouseUp = () => {
                      document.removeEventListener('mousemove', onMouseMove);
                      document.removeEventListener('mouseup', onMouseUp);
                    };
                    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Digital Display - top */}
                    <div style={{ 
                      width: 90, 
                      height: 48, 
                      backgroundColor: '#1f2937', 
                      borderRadius: '8px 8px 0 0', 
                      border: '3px solid #fbbf24',
                      borderBottom: 'none',
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 -2px 4px rgba(0,0,0,0.2)'
                    }}>
                      <div style={{ color: waterLevel > 0 ? '#4ade80' : '#facc15', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>
                        {waterLevel > 0 ? waterLevel.toFixed(2) : '0.00'}
                      </div>
                      <div style={{ color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }}>INCHES</div>
                    </div>
                    
                    {/* Save Dialog */}
                    {showRulerSaveDialog && (
                      <div 
                        style={{
                          position: 'fixed',
                          top: rulerDialogPos?.y ?? '50%',
                          left: rulerDialogPos?.x ?? '50%',
                          transform: rulerDialogPos ? 'none' : 'translate(-50%, -50%)',
                          width: '350px',
                          backgroundColor: 'white',
                          border: '3px solid #fbbf24',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                          zIndex: 1000,
                          overflow: 'hidden'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {/* Draggable Header */}
                        <div 
                          style={{ 
                            backgroundColor: '#1f2937',
                            padding: '12px 24px',
                            cursor: 'move',
                            userSelect: 'none'
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const dialog = e.target.closest('div[style*="position: fixed"]');
                            const rect = dialog.getBoundingClientRect();
                            const offsetX = e.clientX - rect.left;
                            const offsetY = e.clientY - rect.top;
                            
                            const onMouseMove = (moveE) => {
                              setRulerDialogPos({
                                x: moveE.clientX - offsetX,
                                y: moveE.clientY - offsetY
                              });
                            };
                            
                            const onMouseUp = () => {
                              document.removeEventListener('mousemove', onMouseMove);
                              document.removeEventListener('mouseup', onMouseUp);
                            };
                            
                            document.addEventListener('mousemove', onMouseMove);
                            document.addEventListener('mouseup', onMouseUp);
                          }}
                        >
                          <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'white', textAlign: 'center' }}>💾 Save Measurement</div>
                        </div>
                        
                        {/* Dialog Content */}
                        <div style={{ padding: '24px' }}>
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>Measurement Name</label>
                            <input
                              type="text"
                              placeholder="Enter a name for this measurement..."
                              value={rulerSaveName}
                              onChange={(e) => setRulerSaveName(e.target.value)}
                              autoFocus
                              style={{
                                width: '100%',
                                padding: '12px 14px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                border: '2px solid #d1d5db',
                                boxSizing: 'border-box',
                                outline: 'none'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>
                          <div style={{ 
                            fontSize: '28px', 
                            fontWeight: 'bold', 
                            color: '#1d4ed8', 
                            marginBottom: '20px', 
                            textAlign: 'center',
                            backgroundColor: '#eff6ff',
                            padding: '16px',
                            borderRadius: '8px'
                          }}>
                            {waterLevel.toFixed(2)} inches
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => {
                                const defaultName = `Bathtub mnt ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
                                saveMeasurement(waterLevel, rulerSaveName || defaultName, 'in');
                                setRulerSaveName('');
                                setShowRulerSaveDialog(false);
                                setRulerDialogPos(null);
                              }}
                              style={{
                                flex: 1,
                                backgroundColor: '#22c55e',
                                color: 'white',
                                fontSize: '16px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setRulerSaveName('');
                                setShowRulerSaveDialog(false);
                                setRulerDialogPos(null);
                              }}
                              style={{
                                flex: 1,
                                backgroundColor: '#6b7280',
                                color: 'white',
                                fontSize: '16px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Ruler Body */}
                    <div style={{
                      width: 90,
                      height: rulerHeight,
                      backgroundColor: '#fef3c7',
                      border: '3px solid #fbbf24',
                      borderTop: 'none',
                      borderBottom: 'none',
                      position: 'relative',
                      overflow: 'visible',
                      boxShadow: '3px 0 8px rgba(0,0,0,0.2)'
                    }}>
                      {/* Lit up portion (from bottom) */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: litHeight,
                        backgroundColor: 'rgba(74, 222, 128, 0.4)',
                        transition: 'height 0.3s ease'
                      }} />
                      
                      {/* Tick marks - full inch (1-9), half inch, and quarter inch markings */}
                      {Array.from({ length: maxInches * 4 }, (_, i) => {
                        const inch = i / 4;
                        const isFullInch = i % 4 === 0;  // 1, 2, 3...
                        const isHalfInch = i % 4 === 2;  // 0.5, 1.5, 2.5...
                        const isQuarterInch = i % 2 === 1; // 0.25, 0.75, 1.25, 1.75...
                        const bottomPos = inch * pixelsPerInch;
                        
                        // Skip the 0 and 9+ inch marks
                        if (inch === 0 || inch >= 9) return null;
                        
                        let tickWidth, tickHeight, tickColor;
                        if (isFullInch) {
                          tickWidth = 36;
                          tickHeight = 4;
                          tickColor = '#000000';
                        } else if (isHalfInch) {
                          tickWidth = 24;
                          tickHeight = 3;
                          tickColor = '#444444';
                        } else {
                          tickWidth = 14;
                          tickHeight = 2;
                          tickColor = '#666666';
                        }
                        
                        return (
                          <div key={i} style={{
                            position: 'absolute',
                            bottom: bottomPos,
                            left: 0,
                            display: 'flex',
                            alignItems: 'center',
                            transform: 'translateY(50%)'
                          }}>
                            {/* Tick line */}
                            <div style={{
                              width: tickWidth,
                              height: tickHeight,
                              backgroundColor: tickColor
                            }} />
                            {/* Number label - only for full inches, vertically centered */}
                            {isFullInch && (
                              <span style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#000000',
                                marginLeft: '2px',
                                lineHeight: 1
                              }}>
                                {Math.round(inch)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* SAVE Button - at bottom */}
                    <div 
                      style={{
                        width: 90,
                        height: 40,
                        backgroundColor: '#1f2937',
                        borderRadius: '0 0 8px 8px',
                        border: '3px solid #fbbf24',
                        borderTop: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: waterLevel > 0 ? 'pointer' : 'default',
                        opacity: waterLevel > 0 ? 1 : 0.5
                      }}
                      onClick={() => {
                        if (waterLevel > 0) {
                          setShowRulerSaveDialog(true);
                        }
                      }}
                    >
                      <div style={{ fontSize: '16px' }}>💾</div>
                      <div style={{ color: '#ffffff', fontSize: '8px', fontWeight: 'bold' }}>SAVE</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          
          {/* Visible Blocks - rendered at container level so they can move across rooms */}
          {/* Only show blocks if they're in a room with an open door */}
          {blocks.filter(b => b.visible).map(block => {
            // Get actual room boundaries from DOM
            const roomContainer = document.querySelector('[data-room-container]');
            const livingRoom = document.querySelector('[data-room="living"]');
            const bathroom = document.querySelector('[data-room="bathroom"]');
            
            if (!roomContainer || !livingRoom || !bathroom) {
              return null;
            }
            
            const containerRect = roomContainer.getBoundingClientRect();
            const livingRect = livingRoom.getBoundingClientRect();
            const bathroomRect = bathroom.getBoundingClientRect();
            
            const livingRoomEnd = livingRect.bottom - containerRect.top;
            const bathroomStart = bathroomRect.top - containerRect.top;
            
            const blockCenterY = block.y + 25; // center of 50px block
            
            const inLivingRoom = blockCenterY < livingRoomEnd;
            const inBathroom = blockCenterY > bathroomStart;
            const inCorridor = !inLivingRoom && !inBathroom;
            
            // Block is visible if:
            // - In living room and living room door is open
            // - In bathroom and bathroom door is open
            // - In corridor (always visible - it's the passage)
            const shouldShow = 
              (inLivingRoom && livingRoomDoorOpen) ||
              (inBathroom && bathroomDoorOpen) ||
              inCorridor;
            
            if (!shouldShow) return null;
            
            return (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  left: block.x,
                  top: block.y,
                  width: 50,
                  height: 50,
                  backgroundColor: '#f87171',
                  border: '3px solid #dc2626',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  cursor: dragging?.id === block.id ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  zIndex: 20,
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const roomContainer = document.querySelector('[data-room-container]');
                  if (!roomContainer) return;
                  const rect = roomContainer.getBoundingClientRect();
                  setDragOffset({
                    x: e.clientX - rect.left - block.x,
                    y: e.clientY - rect.top - block.y
                  });
                  setDragging({ type: 'block', id: block.id });
                }}
              >
                {block.id + 1}
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {/* Controls */}
          <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '6px', fontSize: '14px' }}>Scenarios</h3>
            <button 
              onClick={reset}
              style={{ width: '100%', backgroundColor: '#6b7280', color: 'white', padding: '6px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginBottom: '8px', fontSize: '13px' }}
            >
              Reset Simulation
            </button>
            <div style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px', color: '#000000' }}>
              <strong>Total Blocks: {TOTAL_BLOCKS}</strong>
            </div>
          </div>

          {/* Block Counter */}
          <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '6px', fontSize: '14px' }}>Block Counter</h3>
            
            {/* Visible counts - Living Room and Bathroom */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <div style={{ flex: 1, backgroundColor: '#eff6ff', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '2px solid #3b82f6' }}>
                <div style={{ fontSize: '12px', marginBottom: '2px' }}>🛋️</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8', fontFamily: 'monospace' }}>
                  {livingRoomDoorOpen ? roomBlockCounts.livingRoom : '--'}
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: '#fff7ed', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '2px solid #f97316' }}>
                <div style={{ fontSize: '12px', marginBottom: '2px' }}>🚿</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ea580c', fontFamily: 'monospace' }}>
                  {bathroomDoorOpen ? roomBlockCounts.bathroom : '--'}
                </div>
              </div>
            </div>
            
            {/* Calculator outputs - Toybox, Bathtub, Total */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Toybox */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                backgroundColor: '#fefce8', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '2px solid #eab308' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🧸</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e' }}>Toybox</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#854d0e', fontFamily: 'monospace' }}>
                    {calculatorResults.toybox !== null ? calculatorResults.toybox.toFixed(1) : '--'}
                  </span>
                  {calculatorResults.toybox !== null && (
                    <>
                      <span style={{ fontSize: '16px' }}>
                        {Math.abs(calculatorResults.toybox - toyboxBlocks) < 0.01 ? '✅' : '❌'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                        ({toyboxBlocks})
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Bathtub */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                backgroundColor: '#eff6ff', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '2px solid #3b82f6' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🛁</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}>Bathtub</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', fontFamily: 'monospace' }}>
                    {calculatorResults.bathtub !== null ? calculatorResults.bathtub.toFixed(1) : '--'}
                  </span>
                  {calculatorResults.bathtub !== null && (
                    <>
                      <span style={{ fontSize: '16px' }}>
                        {Math.abs(calculatorResults.bathtub - bathtubBlocks) < 0.01 ? '✅' : '❌'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                        ({bathtubBlocks})
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Total */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                backgroundColor: '#f0fdf4', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '2px solid #22c55e' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🎯</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534' }}>Total</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534', fontFamily: 'monospace' }}>
                    {calculatorResults.total !== null ? calculatorResults.total.toFixed(1) : '--'}
                  </span>
                  {calculatorResults.total !== null && (
                    <>
                      <span style={{ fontSize: '16px' }}>
                        {Math.abs(calculatorResults.total - TOTAL_BLOCKS) < 0.01 ? '✅' : '❌'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                        ({TOTAL_BLOCKS})
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Open Calculator Button */}
            <button
              onClick={() => setShowCalculator(true)}
              style={{
                width: '100%',
                marginTop: '10px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              🧮 Open Calculator
            </button>
          </div>

          {/* Known Information */}
          <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #22c55e' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '6px', fontSize: '14px' }}>Known Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#000000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '6px', borderRadius: '4px' }}>
                <span style={{ color: '#000000' }}>Empty toy box:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#15803d' }}>{TOYBOX_EMPTY_WEIGHT} oz</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '6px', borderRadius: '4px' }}>
                <span style={{ color: '#000000' }}>Base water level:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#15803d' }}>{BATHTUB_BASE_LEVEL} in</span>
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '14px' }}>Measurements</h3>
              {measurements.length > 0 && (
                <button 
                  onClick={() => setMeasurements([])}
                  style={{ fontSize: '10px', backgroundColor: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Add Custom Measurement Button */}
            <button
              onClick={() => setShowCustomMeasurementDialog(true)}
              style={{
                width: '100%',
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}
            >
              + Add Custom Measurement
            </button>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {measurements.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
                  No measurements yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {measurements.map(m => (
                    <div key={m.id} style={{ backgroundColor: '#f9fafb', padding: '6px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '11px', position: 'relative' }}>
                      <button
                        onClick={() => setMeasurements(prev => prev.filter(item => item.id !== m.id))}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '10px',
                          lineHeight: '1',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '18px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#2563eb' }}>{m.value.toFixed(2)} {m.unit}</span>
                        <span style={{ color: '#6b7280', fontSize: '10px' }}>{m.timestamp}</span>
                      </div>
                      <div style={{ color: '#4b5563', fontSize: '10px' }}>{m.type}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      )}

      {/* Custom Measurement Dialog - rendered at top level to avoid clipping */}
      {showCustomMeasurementDialog && (
        <div 
          style={{
            position: 'fixed',
            top: customDialogPos?.y ?? '50%',
            left: customDialogPos?.x ?? '50%',
            transform: customDialogPos ? 'none' : 'translate(-50%, -50%)',
            width: '420px',
            backgroundColor: 'white',
            border: '3px solid #ef4444',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 1000,
            overflow: 'visible'
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Draggable Header */}
          <div 
            style={{ 
              backgroundColor: '#ef4444',
              padding: '12px 24px',
              cursor: 'move',
              userSelect: 'none',
              borderRadius: '9px 9px 0 0'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const dialog = e.target.closest('div[style*="position: fixed"]');
              const rect = dialog.getBoundingClientRect();
              const offsetX = e.clientX - rect.left;
              const offsetY = e.clientY - rect.top;
              
              const onMouseMove = (moveE) => {
                setCustomDialogPos({
                  x: moveE.clientX - offsetX,
                  y: moveE.clientY - offsetY
                });
              };
              
              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'white', textAlign: 'center' }}>📝 Custom Measurement</div>
          </div>
          
          {/* Dialog Content */}
          <div style={{ padding: '24px' }}>
            {/* Measurement Name */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>Measurement Name</label>
              <input
                type="text"
                placeholder="Enter a name for this measurement..."
                value={customMeasurementName}
                onChange={(e) => setCustomMeasurementName(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            {/* Value and Unit */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>Value & Unit</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  placeholder="0.00"
                  value={customMeasurementValue}
                  onChange={(e) => setCustomMeasurementValue(e.target.value)}
                  style={{
                    flex: 2,
                    padding: '12px 14px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    boxSizing: 'border-box',
                    outline: 'none',
                    textAlign: 'center'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <select
                  value={customMeasurementUnit}
                  onChange={(e) => setCustomMeasurementUnit(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="oz">oz</option>
                  <option value="in">in</option>
                  <option value="blocks">blocks</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  if (customMeasurementValue) {
                    const defaultName = `Custom mnt ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
                    saveMeasurement(
                      parseFloat(customMeasurementValue), 
                      customMeasurementName || defaultName, 
                      customMeasurementUnit
                    );
                    setCustomMeasurementName('');
                    setCustomMeasurementValue('');
                    setCustomMeasurementUnit('oz');
                    setShowCustomMeasurementDialog(false);
                    setCustomDialogPos(null);
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  fontSize: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setCustomMeasurementName('');
                  setCustomMeasurementValue('');
                  setCustomMeasurementUnit('oz');
                  setShowCustomMeasurementDialog(false);
                  setCustomDialogPos(null);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  fontSize: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Dialog */}
      {showCalculator && (
        <div 
          style={{
            position: 'fixed',
            top: calculatorPos?.y ?? '50%',
            left: calculatorPos?.x ?? '50%',
            transform: calculatorPos ? 'none' : 'translate(-50%, -50%)',
            width: '480px',
            backgroundColor: 'white',
            border: '3px solid #8b5cf6',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 1000,
            overflow: 'visible'
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Draggable Header */}
          <div 
            style={{ 
              backgroundColor: '#8b5cf6',
              padding: '12px 24px',
              cursor: 'move',
              userSelect: 'none',
              borderRadius: '9px 9px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const dialog = e.target.closest('div[style*="position: fixed"]');
              const rect = dialog.getBoundingClientRect();
              const offsetX = e.clientX - rect.left;
              const offsetY = e.clientY - rect.top;
              
              const onMouseMove = (moveE) => {
                setCalculatorPos({
                  x: moveE.clientX - offsetX,
                  y: moveE.clientY - offsetY
                });
              };
              
              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'white' }}>🧮 Calculator</div>
            <button
              onClick={() => {
                setShowCalculator(false);
                setCalculatorPos(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0 8px'
              }}
            >
              ×
            </button>
          </div>
          
          {/* Digital Display - shows result */}
          <div style={{
            backgroundColor: '#1f2937',
            padding: '16px 20px',
            margin: '0',
            borderBottom: '2px solid #374151'
          }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#22c55e',
              textAlign: 'right',
              minHeight: '44px'
            }}>
              {calculatorLastResult !== null 
                ? (Number.isInteger(calculatorLastResult) ? calculatorLastResult : calculatorLastResult.toFixed(2))
                : '--'
              }
            </div>
          </div>
          
          {/* Dialog Content */}
          <div style={{ padding: '20px' }}>
            {/* Formula Input */}
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              minHeight: '50px',
              border: '2px solid #d1d5db',
              fontFamily: 'monospace',
              fontSize: '18px',
              wordBreak: 'break-all'
            }}>
              {calculatorFormula.length === 0 ? (
                <span style={{ color: '#9ca3af' }}>Select measurements and operations...</span>
              ) : (
                calculatorFormula.map((item, idx) => (
                  <span key={idx} style={{ 
                    color: item.type === 'operator' ? '#8b5cf6' : '#1f2937',
                    fontWeight: item.type === 'operator' ? 'bold' : 'normal'
                  }}>
                    {item.display}{' '}
                  </span>
                ))
              )}
            </div>
            
            {/* Measurement Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                Add Measurement
              </label>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    // Check if it's a known constant
                    const knownConstants = {
                      'empty_toybox': { value: TOYBOX_EMPTY_WEIGHT, display: '16', name: 'Empty toybox weight' },
                      'base_water': { value: BATHTUB_BASE_LEVEL, display: '6', name: 'Base water level' }
                    };
                    
                    if (knownConstants[e.target.value]) {
                      const constant = knownConstants[e.target.value];
                      setCalculatorFormula(prev => [...prev, {
                        type: 'measurement',
                        value: constant.value,
                        display: constant.display,
                        name: constant.name
                      }]);
                      setCalculatorLastResult(null); // Clear result when formula changes
                    } else {
                      // It's a saved measurement - compare as strings since select value is always string
                      const measurement = measurements.find(m => String(m.id) === e.target.value);
                      if (measurement) {
                        setCalculatorFormula(prev => [...prev, {
                          type: 'measurement',
                          value: measurement.value,
                          display: `${measurement.value}`,
                          name: measurement.type
                        }]);
                        setCalculatorLastResult(null); // Clear result when formula changes
                      }
                    }
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: '2px solid #d1d5db',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                <option value="">-- Select a measurement --</option>
                <optgroup label="Known Information">
                  <option value="empty_toybox">Empty toybox: {TOYBOX_EMPTY_WEIGHT} oz</option>
                  <option value="base_water">Base water level: {BATHTUB_BASE_LEVEL} in</option>
                </optgroup>
                {measurements.length > 0 && (
                  <optgroup label="Saved Measurements">
                    {measurements.map(m => (
                      <option key={m.id} value={String(m.id)}>
                        {m.type}: {m.value.toFixed(2)} {m.unit}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            
            {/* Operation Buttons */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                Operations
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { symbol: '(', display: '(' },
                  { symbol: ')', display: ')' },
                  { symbol: '+', display: '+' },
                  { symbol: '-', display: '−' },
                  { symbol: '/', display: '÷' }
                ].map(op => (
                  <button
                    key={op.symbol}
                    onClick={() => {
                      setCalculatorFormula(prev => [...prev, {
                        type: 'operator',
                        value: op.symbol,
                        display: op.display
                      }]);
                      setCalculatorLastResult(null); // Clear result when formula changes
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {op.display}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setCalculatorFormula(prev => prev.slice(0, -1));
                    setCalculatorLastResult(null);
                  }}
                  style={{
                    width: '50px',
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  ⌫
                </button>
              </div>
            </div>
            
            {/* Output Type Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                Calculate For
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'toybox', emoji: '🧸', label: 'Toybox' },
                  { key: 'bathtub', emoji: '🛁', label: 'Bathtub' },
                  { key: 'total', emoji: '🎯', label: 'Total' },
                  { key: 'custom', emoji: '📝', label: 'Custom' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setCalculatorOutputType(opt.key)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      backgroundColor: calculatorOutputType === opt.key ? '#8b5cf6' : '#f3f4f6',
                      color: calculatorOutputType === opt.key ? 'white' : '#374151',
                      border: calculatorOutputType === opt.key ? '2px solid #7c3aed' : '2px solid #d1d5db',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      minWidth: '80px'
                    }}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Output Name/Unit - only show when Custom is selected */}
            {calculatorOutputType === 'custom' && (
              <div style={{ marginBottom: '16px', backgroundColor: '#faf5ff', padding: '12px', borderRadius: '8px', border: '2px solid #c4b5fd' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#6b21a8', marginBottom: '8px' }}>
                  Save As
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Measurement name..."
                    value={calculatorCustomName}
                    onChange={(e) => setCalculatorCustomName(e.target.value)}
                    style={{
                      flex: 2,
                      padding: '10px 12px',
                      fontSize: '14px',
                      borderRadius: '6px',
                      border: '2px solid #d1d5db',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <select
                    value={calculatorCustomUnit}
                    onChange={(e) => setCalculatorCustomUnit(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      border: '2px solid #d1d5db',
                      boxSizing: 'border-box',
                      outline: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="blocks">blocks</option>
                    <option value="oz">oz</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            {(() => {
              const canCompute = isComputable(calculatorFormula);
              return (
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Calculate Button - only computes and shows result, does NOT save */}
                  <button
                    onClick={() => {
                      if (!canCompute) return;
                      
                      const expr = calculatorFormula.map(item => {
                        if (item.type === 'measurement') return item.value;
                        if (item.type === 'operator') return item.value;
                        return '';
                      }).join(' ');
                      
                      try {
                        const result = Function('"use strict"; return (' + expr + ')')();
                        if (typeof result === 'number' && !isNaN(result)) {
                          setCalculatorLastResult(result);
                        }
                      } catch (e) {
                        // Silent fail - button shouldn't be enabled for invalid expressions anyway
                      }
                    }}
                    disabled={!canCompute}
                    style={{
                      flex: 1,
                      backgroundColor: canCompute ? '#22c55e' : 'rgba(34, 197, 94, 0.3)',
                      color: 'white',
                      fontSize: '16px',
                      padding: '14px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: canCompute ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      opacity: canCompute ? 1 : 0.5,
                      transition: 'opacity 0.2s, background-color 0.2s'
                    }}
                  >
                    = Calculate
                  </button>
                  
                  {/* Save Button - saves to Measurements AND to Block Counter */}
                  <button
                    onClick={() => {
                      if (calculatorLastResult === null) return;
                      
                      // Save to Measurements with appropriate name
                      if (calculatorOutputType === 'custom') {
                        const formulaStr = calculatorFormula.map(i => i.display).join(' ');
                        const name = calculatorCustomName || `Calc: ${formulaStr}`;
                        saveMeasurement(calculatorLastResult, name, calculatorCustomUnit);
                        setCalculatorCustomName('');
                      } else {
                        // Use the output type name: Toybox, Bathtub, or Total with index
                        const outputNames = { toybox: 'Toybox', bathtub: 'Bathtub', total: 'Total' };
                        const baseName = outputNames[calculatorOutputType];
                        const existingCount = measurements.filter(m => m.type.startsWith(baseName + ' mnt')).length;
                        const indexedName = `${baseName} mnt${existingCount + 1}`;
                        saveMeasurement(calculatorLastResult, indexedName, 'blocks');
                        // Also save to Block Counter
                        setCalculatorResults(prev => ({
                          ...prev,
                          [calculatorOutputType]: calculatorLastResult
                        }));
                      }
                    }}
                    disabled={calculatorLastResult === null}
                    style={{
                      flex: 1,
                      backgroundColor: calculatorLastResult === null ? 'rgba(59, 130, 246, 0.3)' : '#3b82f6',
                      color: 'white',
                      fontSize: '16px',
                      padding: '14px',
                      borderRadius: '8px',
                  border: 'none',
                  cursor: calculatorLastResult === null ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: calculatorLastResult === null ? 0.5 : 1,
                  transition: 'opacity 0.2s, background-color 0.2s'
                }}
              >
                💾 Save
              </button>
            </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
