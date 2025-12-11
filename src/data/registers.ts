import { RegisterDef, RegisterDefinitions } from '../types/register';

export const REGISTERS: RegisterDef[] = [
  {
    addr: 0x00,
    name: 'IOCFG2',
    description: 'GDO2 Output Pin Configuration',
    bitFields: [
      { bits: '7', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '6',
        name: 'GDO2_INV',
        reset: 0,
        rw: 'R/W',
        desc: 'Invert output, i.e. select active low (1) / high (0)'
      },
      {
        bits: '5:0',
        name: 'GDO2_CFG[5:0]',
        reset: 41,
        rw: 'R/W',
        desc: 'Default is CHP_RDYn (See Table 41 on page 62).'
      }
    ]
  },
  {
    addr: 0x01,
    name: 'IOCFG1',
    description: 'GDO1 Output Pin Configuration',
    bitFields: [
      {
        bits: '7',
        name: 'GDO_DS',
        reset: 0,
        rw: 'R/W',
        desc: 'Set high (1) or low (0) output drive strength on the GDO pins.'
      },
      {
        bits: '6',
        name: 'GDO1_INV',
        reset: 0,
        rw: 'R/W',
        desc: 'Invert output, i.e. select active low (1) / high (0)'
      },
      {
        bits: '5:0',
        name: 'GDO1_CFG[5:0]',
        reset: 46,
        rw: 'R/W',
        desc: 'Default is 3-state (See Table 41 on page 62).'
      }
    ]
  },
  {
    addr: 0x02,
    name: 'IOCFG0',
    description: 'GDO0 Output Pin Configuration',
    bitFields: [
      {
        bits: '7',
        name: 'TEMP_SENSOR_ENABLE',
        reset: 0,
        rw: 'R/W',
        desc: 'Enable analog temperature sensor. Write 0 in all other register bits when using temperature sensor.'
      },
      {
        bits: '6',
        name: 'GDO0_INV',
        reset: 0,
        rw: 'R/W',
        desc: 'Invert output, i.e. select active low (1) / high (0)'
      },
      {
        bits: '5:0',
        name: 'GDO0_CFG[5:0]',
        reset: 63,
        rw: 'R/W',
        desc: 'Default is CLK_XOSC/192 (See Table 41 on page 62). It is recommended to disable the clock output in initialization, in order to optimize RF performance.'
      }
    ]
  },
  {
    addr: 0x03,
    name: 'FIFOTHR',
    description: 'RX FIFO and TX FIFO Thresholds',
    bitFields: [
      {
        bits: '7',
        name: '0',
        reset: 0,
        rw: 'R/W',
        desc: 'Reserved, write 0 for compatibility with possible future extensions'
      },
      {
        bits: '6',
        name: 'ADC_RETENTION',
        reset: 0,
        rw: 'R/W',
        desc: '0: TEST1 = 0x31 and TEST2= 0x88 when waking up from SLEEP\n1: TEST1 = 0x35 and TEST2 = 0x81 when waking up from SLEEP\n\nNote that the changes in TEST registers due to the ADC_RETENTION bit setting are only seen INTERNALLY in the analog part. The values read from the TEST registers when waking up from SLEEP mode will always be the reset value.\n\nThe ADC_RETENTION bit should be set to 1 before going into SLEEP mode if settings with an RX filter bandwidth below 325 kHz are wanted at the time of wake-up.'
      },
      { bits: '5:4', name: 'CLOSE_IN_RX[1:0]', reset: 0, rw: 'R/W', desc: 'For more details, please see DN010' },
      {
        bits: '3:0',
        name: 'FIFO_THR[3:0]',
        reset: 7,
        rw: 'R/W',
        desc: 'Set the threshold for the TX FIFO and RX FIFO. The threshold is exceeded when the number of bytes in the FIFO is equal to or higher than the threshold value.'
      }
    ]
  },
  {
    addr: 0x04,
    name: 'SYNC1',
    description: 'Sync Word, High Byte',
    bitFields: [{ bits: '7:0', name: 'SYNC[15:8]', reset: 211, rw: 'R/W', desc: '8 MSB of 16-bit sync word' }]
  },
  {
    addr: 0x05,
    name: 'SYNC0',
    description: 'Sync Word, Low Byte',
    bitFields: [{ bits: '7:0', name: 'SYNC[7:0]', reset: 145, rw: 'R/W', desc: '8 LSB of 16-bit sync word' }]
  },
  {
    addr: 0x06,
    name: 'PKTLEN',
    description: 'Packet Length',
    bitFields: [
      {
        bits: '7:0',
        name: 'PACKET_LENGTH[7:0]',
        reset: 255,
        rw: 'R/W',
        desc: 'Indicates the packet length when fixed packet length mode is enabled'
      }
    ]
  },
  {
    addr: 0x07,
    name: 'PKTCTRL1',
    description: 'Packet Automation Control',
    bitFields: [
      {
        bits: '7:5',
        name: 'PQT[2:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Preamble quality estimator threshold. The preamble quality estimator increases an internal counter by one each time a bit is received that is different from the previous bit, and decreases the counter by 8 each time a bit is received that is the same as the last bit.\n\nA threshold of 4·PQT for this counter is used to gate sync word detection. When PQT = 0 a sync word is always accepted.'
      },
      { bits: '4', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '3',
        name: 'CRC_AUTOFLUSH',
        reset: 0,
        rw: 'R/W',
        desc: 'Enable automatic flush of RX FIFO when CRC is not OK. This requires that only one packet is in the RX FIFO and that packet length is limited to the RX FIFO size.'
      },
      {
        bits: '2',
        name: 'APPEND_STATUS',
        reset: 1,
        rw: 'R/W',
        desc: 'When enabled, two status bytes will be appended to the payload of the packet. The status bytes contain RSSI and LQI values, as well as CRC OK.'
      },
      { bits: '1:0', name: 'ADR_CHK[1:0]', reset: 0, rw: 'R/W', desc: 'Controls address check configuration of received packages' }
    ]
  },
  {
    addr: 0x08,
    name: 'PKTCTRL0',
    description: 'Packet Automation Control',
    bitFields: [
      { bits: '7', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '6',
        name: 'WHITE_DATA',
        reset: 1,
        rw: 'R/W',
        desc: 'Turn data whitening on / off\n0: Whitening off\n1: Whitening on'
      },
      { bits: '5:4', name: 'PKT_FORMAT[1:0]', reset: 0, rw: 'R/W', desc: 'Format of RX and TX data' },
      { bits: '3', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '2', name: 'CRC_EN', reset: 1, rw: 'R/W', desc: '1: CRC calculation in TX and CRC check in RX enabled\n0: CRC disabled for TX and RX' },
      { bits: '1:0', name: 'LENGTH_CONFIG[1:0]', reset: 1, rw: 'R/W', desc: 'Configure the packet length' }
    ]
  },
  {
    addr: 0x09,
    name: 'ADDR',
    description: 'Device Address',
    bitFields: [
      {
        bits: '7:0',
        name: 'DEVICE_ADDR[7:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Address used for packet filtration. Optional broadcast addresses are 0 (0x00) and 255 (0xFF).'
      }
    ]
  },
  {
    addr: 0x0A,
    name: 'CHANNR',
    description: 'Channel Number',
    bitFields: [{ bits: '7:0', name: 'CHAN[7:0]', reset: 0, rw: 'R/W', desc: 'The 8-bit unsigned channel number, which is multiplied by the channel spacing setting and added to the base frequency.' }]
  },
  {
    addr: 0x0B,
    name: 'FSCTRL1',
    description: 'Frequency Synthesizer Control',
    bitFields: [
      { bits: '7:6', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '5', name: '0', reset: 0, rw: 'R/W', desc: 'Reserved' },
      {
        bits: '4:0',
        name: 'FREQ_IF[4:0]',
        reset: 15,
        rw: 'R/W',
        desc: 'The desired IF frequency to employ in RX. Subtracted from FS base frequency in RX and controls the digital complex mixer in the demodulator.\n\nIF frequency formula:\nf_IF = (f_XOSC / 2^10) · FREQ_IF\n\nThe default value gives an IF frequency of 381 kHz, assuming a 26.0 MHz crystal.'
      }
    ]
  },
  {
    addr: 0x0C,
    name: 'FSCTRL0',
    description: 'Frequency Synthesizer Control',
    bitFields: [
      {
        bits: '7:0',
        name: 'FREQOFF[7:0]',
        reset: 0,
        rw: 'R/W',
        desc: "Frequency offset added to the base frequency before being used by the frequency synthesizer (2's-complement).\n\nResolution is f_XTAL / 2^14 (~1.59 kHz – 1.65 kHz); range ±202 kHz to ±210 kHz, depending on XTAL frequency."
      }
    ]
  },
  {
    addr: 0x0D,
    name: 'FREQ2',
    description: 'Frequency Control Word, High Byte',
    bitFields: [
      { bits: '7:6', name: 'FREQ[23:22]', reset: 0, rw: 'R', desc: 'FREQ[23:22] is always 0 (the FREQ2 register is less than 36 with 26–27 MHz crystal)' },
      {
        bits: '5:0',
        name: 'FREQ[21:16]',
        reset: 30,
        rw: 'R/W',
        desc: 'FREQ[23:0] is the base frequency for the frequency synthesizer in increments of f_XOSC / 2^16\n\nCarrier frequency formula:\nf_carrier = (f_XOSC / 2^16) · FREQ[23:0]'
      }
    ]
  },
  {
    addr: 0x0E,
    name: 'FREQ1',
    description: 'Frequency Control Word, Middle Byte',
    bitFields: [{ bits: '7:0', name: 'FREQ[15:8]', reset: 196, rw: 'R/W', desc: 'Ref. FREQ2 register' }]
  },
  {
    addr: 0x0F,
    name: 'FREQ0',
    description: 'Frequency Control Word, Low Byte',
    bitFields: [{ bits: '7:0', name: 'FREQ[7:0]', reset: 236, rw: 'R/W', desc: 'Ref. FREQ2 register' }]
  },
  {
    addr: 0x10,
    name: 'MDMCFG4',
    description: 'Modem Configuration',
    bitFields: [
      { bits: '7:6', name: 'CHANBW_E[1:0]', reset: 2, rw: 'R/W', desc: '—' },
      {
        bits: '5:4',
        name: 'CHANBW_M[1:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Sets the decimation ratio for the delta-sigma ADC input stream and thus the channel bandwidth.\n\nChannel bandwidth:\nBW_channel = f_XOSC / (8 · (4 + CHANBW_M) · 2^CHANBW_E)\n\nDefault values ≈ 203 kHz channel filter bandwidth (26.0 MHz crystal).'
      },
      { bits: '3:0', name: 'DRATE_E[3:0]', reset: 12, rw: 'R/W', desc: 'The exponent of the user-specified symbol rate.' }
    ]
  },
  {
    addr: 0x11,
    name: 'MDMCFG3',
    description: 'Modem Configuration',
    bitFields: [
      {
        bits: '7:0',
        name: 'DRATE_M[7:0]',
        reset: 34,
        rw: 'R/W',
        desc: 'Mantissa of the user-specified symbol rate.\n\nSymbol rate uses an unsigned floating-point format:\n- 9-bit mantissa (hidden "1" bit)\n- 4-bit exponent\n\nResulting data rate:\nR_DATA = ((256 + DRATE_M) · 2^DRATE_E · f_XOSC) / 2^28\n\nDefault values give ≈115.051 kBaud (closest to 115.2 kBaud), assuming a 26.0 MHz crystal.'
      }
    ]
  },
  {
    addr: 0x12,
    name: 'MDMCFG2',
    description: 'Modem Configuration',
    bitFields: [
      {
        bits: '7',
        name: 'DEM_DCFILT_OFF',
        reset: 0,
        rw: 'R/W',
        desc: 'Disable digital DC blocking filter before demodulator.\n0 = Enable (better sensitivity)\n1 = Disable (current optimized). Only for data rates ≤ 250 kBaud.\n\nThe recommended IF frequency changes when the DC blocking is disabled. Please use SmartRF Studio to calculate correct register setting.'
      },
      { bits: '6:4', name: 'MOD_FORMAT[2:0]', reset: 0, rw: 'R/W', desc: 'The modulation format of the radio signal' },
      { bits: '3', name: 'MANCHESTER_EN', reset: 0, rw: 'R/W', desc: 'Enables Manchester encoding/decoding.\n0 = Disable\n1 = Enable' },
      {
        bits: '2:0',
        name: 'SYNC_MODE[2:0]',
        reset: 2,
        rw: 'R/W',
        desc: 'Combined sync-word qualifier mode.\n\n- 0 (000) and 4 (100): Disable preamble & sync word transmission in TX and disable preamble & sync word detection in RX.\n\n- 1 (001), 2 (010), 5 (101), 6 (110): Enable 16-bit sync word transmission in TX and 16-bit sync word detection in RX. Only 15 of 16 bits need to match in RX when using: * 1 (001) * 5 (101)\n\n- 3 (011) and 7 (111): Enable repeated sync-word transmission in TX and 32-bit sync word detection in RX (only 30 of 32 bits must match).'
      }
    ]
  },
  {
    addr: 0x13,
    name: 'MDMCFG1',
    description: 'Modem Configuration',
    bitFields: [
      {
        bits: '7',
        name: 'FEC_EN',
        reset: 0,
        rw: 'R/W',
        desc: 'Enable Forward Error Correction (FEC) with interleaving for packet payload.\n0 = Disable\n1 = Enable (Only supported for fixed packet length mode, i.e. PKTCTRL0.LENGTH_CONFIG = 0)'
      },
      { bits: '6:4', name: 'NUM_PREAMBLE[2:0]', reset: 2, rw: 'R/W', desc: 'Sets the minimum number of preamble bytes to be transmitted.' },
      { bits: '3:2', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '1:0', name: 'CHANSPC_E[1:0]', reset: 2, rw: 'R/W', desc: '2-bit exponent of channel spacing.' }
    ]
  },
  {
    addr: 0x14,
    name: 'MDMCFG0',
    description: 'Modem Configuration',
    bitFields: [
      {
        bits: '7:0',
        name: 'CHANSPC_M[7:0]',
        reset: 248,
        rw: 'R/W',
        desc: '8-bit mantissa of channel spacing.\nThe channel spacing is multiplied by the channel number CHAN and added to the base frequency. It is unsigned and has the form:\n\nΔf_CHANNEL = (f_XOSC / 2^18) · (256 + CHANSPC_M) · 2^CHANSPC_E\n\nThe default values give approximately 199.951 kHz channel spacing (closest setting to 200 kHz), assuming a 26.0 MHz crystal.'
      }
    ]
  },
  {
    addr: 0x15,
    name: 'DEVIATN',
    description: 'Modem Deviation Setting',
    bitFields: [
      { bits: '7', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '6:4', name: 'DEVIATION_E[2:0]', reset: 4, rw: 'R/W', desc: 'Deviation exponent.' },
      { bits: '3', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '2:0',
        name: 'DEVIATION_M[2:0]',
        reset: 7,
        rw: 'R/W',
        desc: 'TX section:\n\nSpecifies the nominal frequency deviation from the carrier for a "0" (–DEVIATN) and "1" (+DEVIATN) in a mantissa-exponent format, interpreted as a 4-bit value with MSB implicit 1.\n\nThe resulting deviation is:\n\n f_dev = (f_XOSC / 2^17) · (8 + DEVIATION_M) · 2^DEVIATION_E\n\nDefault values give ±47.607 kHz deviation (26.0 MHz crystal).\n\nMSK:\nSpecifies the fraction of symbol period (1/8–8/8) during which a phase change occurs ("0": +90°, "1": –90°). Refer to SmartRF Studio for correct DEVIATN setting when using MSK.\n\nASK/OOK:\nThis setting has no effect.\n\nRX section:\n\nSpecifies the expected frequency deviation of incoming signal. Must be approximately correct for reliable demodulation.\n\nMSK / ASK/OOK:\nThis setting has no effect.'
      }
    ]
  },
  {
    addr: 0x16,
    name: 'MCSM2',
    description: 'Main Radio Control State Machine Configuration',
    bitFields: [
      { bits: '7:5', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '4',
        name: 'RX_TIME_RSSI',
        reset: 0,
        rw: 'R/W',
        desc: 'Direct RX termination based on RSSI measurement (carrier sense).\nFor ASK/OOK modulation, RX times out if there is no carrier sense in the first 8 symbol periods.'
      },
      {
        bits: '3',
        name: 'RX_TIME_QUAL',
        reset: 0,
        rw: 'R/W',
        desc: 'When the RX_TIME timer expires, the chip checks if sync word is found when RX_TIME_QUAL = 0,\nOR either sync word is found OR PQI is set when RX_TIME_QUAL = 1.'
      },
      {
        bits: '2:0',
        name: 'RX_TIME[2:0]',
        reset: 7,
        rw: 'R/W',
        desc: 'Timeout for sync word search in RX for both WOR mode and normal RX.\nThe timeout is relative to the programmed EVENT0 timeout.\n\nThe RX timeout in microseconds is given by:\n\nRXtimeout = EVENT0 · C_RX_TIME,WOR_RES / (26X)\n\nwhere C depends on RX_TIME and WOR_RES (table below),\nand X is the crystal oscillator frequency in MHz.\n\nTimeout table (values of C):\nSetting | WOR_RES=0 | WOR_RES=1 | WOR_RES=2 | WOR_RES=3\n0 (000) | 3.6058    | 18.0288   | 32.4519   | 46.8750\n1 (001) | 1.8029    | 9.0144    | 16.2260   | 23.4375\n2 (010) | 0.9014    | 4.5072    | 8.1130    | 11.7188\n3 (011) | 0.4507    | 2.2536    | 4.0565    | 5.8594\n4 (100) | 0.2254    | 1.1268    | 2.0282    | 2.9297\n5 (101) | 0.1127    | 0.5634    | 1.0141    | 1.4648\n6 (110) | 0.0563    | 0.2817    | 0.5071    | 0.7324\n7 (111) | Until end of packet (WOR does not use this)\n\nExample:\nEVENT0 = 34666, WOR_RES = 0, RX_TIME = 6\n=> RX timeout = 1.96 ms, polling interval = 1 s, duty cycle ≈ 0.195%.\n\nNotes:\n- WOR_RES must be 0 or 1 when using WOR, since WOR_RES >1 gives extremely low duty cycles.\n- When WOR is not used, all WOR_RES values are allowed.\n- RC oscillator must be enabled for RX_TIME values 0–6 because timeout counts RC oscillator periods.\n- Timeout counter resolution is limited:\n  With RX_TIME=0: timeout uses 13 MSBs of EVENT0\n  With RX_TIME=6: timeout uses 7 MSBs of EVENT0'
      }
    ]
  },
  {
    addr: 0x17,
    name: 'MCSM1',
    description: 'Main Radio Control State Machine Configuration',
    bitFields: [
      { bits: '7:6', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '5:4', name: 'CCA_MODE[1:0]', reset: 3, rw: 'R/W', desc: 'Selects CCA_MODE; reflected in CCA signal.' },
      {
        bits: '3:2',
        name: 'RXOFF_MODE[1:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Select what should happen after a packet has been received.\n\nNote:\nIt is not possible to set RXOFF_MODE to TX or FSTXON while using CCA at the same time.'
      },
      { bits: '1:0', name: 'TXOFF_MODE[1:0]', reset: 0, rw: 'R/W', desc: 'Select what should happen after a packet has been sent (TX).' }
    ]
  },
  {
    addr: 0x18,
    name: 'MCSM0',
    description: 'Main Radio Control State Machine Configuration',
    bitFields: [
      { bits: '7:6', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '5:4',
        name: 'FS_AUTOCAL[1:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Automatically calibrate when going to RX or TX, or back to IDLE.\n\nNote:\nIn some automatic wake-on-radio (WOR) applications, using setting 3 (11) can significantly reduce current consumption.'
      },
      {
        bits: '3:2',
        name: 'PO_TIMEOUT[1:0]',
        reset: 1,
        rw: 'R/W',
        desc: 'Programs how many six-bit ripple counter cycles must expire after XOSC has stabilized before CHP_RDYn goes low.\n\nIf XOSC is on (stable) during power-down:\nPO_TIMEOUT should be set so the regulated digital supply voltage has time to stabilize before CHP_RDYn goes low. Recommended: PO_TIMEOUT = 2.\n\nTypical start-up time for voltage regulator: 50 µs.\n\nFor robust operation when XOSC is off during power-down:\nPO_TIMEOUT of 2 or 3 is recommended.\n\n[1] Note:\nXOSC_STABLE is asserted at the same time as CHP_RDYn. PO_TIMEOUT delays both signals together; no extra delay is inserted between them.\n\nExact timeout depends on crystal frequency.'
      },
      { bits: '1', name: 'PIN_CTRL_EN', reset: 0, rw: 'R/W', desc: 'Enables the pin radio control option.' },
      { bits: '0', name: 'XOSC_FORCE_ON', reset: 0, rw: 'R/W', desc: 'Force the XOSC to stay on in SLEEP state.' }
    ]
  },
  {
    addr: 0x19,
    name: 'FOCCFG',
    description: 'Frequency Offset Compensation Configuration',
    bitFields: [
      { bits: '7:6', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '5',
        name: 'FOC_BS_CS_GATE',
        reset: 1,
        rw: 'R/W',
        desc: 'If set, the demodulator freezes the frequency offset compensation and clock recovery feedback loops until the CS (carrier sense) signal goes high.'
      },
      { bits: '4:3', name: 'FOC_PRE_K[1:0]', reset: 2, rw: 'R/W', desc: 'Frequency compensation loop gain to be used before a sync word is detected.' },
      {
        bits: '2',
        name: 'FOC_POST_K',
        reset: 1,
        rw: 'R/W',
        desc: 'Frequency compensation loop gain to be used after a sync word is detected.\n\nLoop gain (post-sync):\nSetting | Loop gain (post-sync)\n0       | Same as FOC_PRE_K\n1       | K / 2'
      },
      {
        bits: '1:0',
        name: 'FOC_LIMIT[1:0]',
        reset: 2,
        rw: 'R/W',
        desc: 'Saturation limit for the frequency offset compensation algorithm.\n\nNote:\n- Frequency offset compensation is not supported for ASK/OOK.\n- Always use FOC_LIMIT = 0 with these modulation formats.'
      }
    ]
  },
  {
    addr: 0x1A,
    name: 'BSCFG',
    description: 'Bit Synchronization Configuration',
    bitFields: [
      {
        bits: '7:6',
        name: 'BS_PRE_KI[1:0]',
        reset: 1,
        rw: 'R/W',
        desc: 'Clock recovery feedback loop integral gain to be used before a sync word is detected (used to correct offsets in data rate).'
      },
      {
        bits: '5:4',
        name: 'BS_PRE_KP[1:0]',
        reset: 2,
        rw: 'R/W',
        desc: 'Clock recovery feedback loop proportional gain to be used before a sync word is detected.'
      },
      {
        bits: '3',
        name: 'BS_POST_KI',
        reset: 1,
        rw: 'R/W',
        desc: 'Clock recovery feedback loop integral gain to be used after a sync word is detected.\n\nClock recovery loop integral gain (post-sync):\nSetting | Clock recovery loop integral gain (post-sync)\n0       | Same as BS_PRE_KI\n1       | K_I / 2'
      },
      {
        bits: '2',
        name: 'BS_POST_KP',
        reset: 1,
        rw: 'R/W',
        desc: 'Clock recovery feedback loop proportional gain to be used after a sync word is detected.\n\nClock recovery loop proportional gain (post-sync):\nSetting | Clock recovery loop proportional gain (post-sync)\n0       | Same as BS_PRE_KP\n1       | K_P'
      },
      { bits: '1:0', name: 'BS_LIMIT[1:0]', reset: 0, rw: 'R/W', desc: 'Saturation point for the data rate offset compensation algorithm.' }
    ]
  },
  {
    addr: 0x1B,
    name: 'AGCCTRL2',
    description: 'AGC Control',
    bitFields: [
      { bits: '7:6', name: 'MAX_DVGA_GAIN[1:0]', reset: 0, rw: 'R/W', desc: 'Reduces the maximum allowable DVGA gain.' },
      { bits: '5:3', name: 'MAX_LNA_GAIN[2:0]', reset: 0, rw: 'R/W', desc: 'Sets the maximum allowable LNA + LNA 2 gain relative to the maximum possible gain.' },
      { bits: '2:0', name: 'MAGN_TARGET[2:0]', reset: 3, rw: 'R/W', desc: 'Sets the target value for the averaged amplitude from the digital channel filter (1 LSB = 0 dB).' }
    ]
  },
  {
    addr: 0x1C,
    name: 'AGCCTRL1',
    description: 'AGC Control',
    bitFields: [
      { bits: '7', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '6',
        name: 'AGC_LNA_PRIORITY',
        reset: 1,
        rw: 'R/W',
        desc: 'Selects between two different strategies for LNA and LNA 2 gain adjustment.\nWhen 1: LNA gain is decreased first.\nWhen 0: LNA 2 gain is decreased to minimum before decreasing LNA gain.'
      },
      { bits: '5:4', name: 'CARRIER_SENSE_REL_THR[1:0]', reset: 0, rw: 'R/W', desc: 'Sets the relative change threshold for asserting carrier sense.' },
      {
        bits: '3:0',
        name: 'CARRIER_SENSE_ABS_THR[3:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Sets the absolute RSSI threshold for asserting carrier sense. The threshold is 2-complement signed, in steps of 1 dB, and is relative to the MAGN_TARGET setting.'
      }
    ]
  },
  {
    addr: 0x1D,
    name: 'AGCCTRL0',
    description: 'AGC Control',
    bitFields: [
      { bits: '7:6', name: 'HYST_LEVEL[1:0]', reset: 2, rw: 'R/W', desc: 'Sets the level of hysteresis on the magnitude deviation' },
      { bits: '5:4', name: 'WAIT_TIME[1:0]', reset: 1, rw: 'R/W', desc: 'Sets the number of channel filter samples from a gain adjustment' },
      { bits: '3:2', name: 'AGC_FREEZE[1:0]', reset: 0, rw: 'R/W', desc: 'Control when the AGC gain should be frozen' },
      { bits: '1:0', name: 'FILTER_LENGTH[1:0]', reset: 1, rw: 'R/W', desc: 'Sets the averaging length for the amplitude from the channel filter' }
    ]
  },
  {
    addr: 0x1E,
    name: 'WOREVT1',
    description: 'High Byte Event0 Timeout',
    bitFields: [
      {
        bits: '7:0',
        name: 'EVENT0[15:8]',
        reset: 135,
        rw: 'R/W',
        desc: 'High byte of EVENT0 timeout register.\n\nTimeout formula:\nt_Event0 = (750 / f_XOSC) · EVENT0 · 2^(5-WOR_RES)'
      }
    ]
  },
  {
    addr: 0x1F,
    name: 'WOREVT0',
    description: 'Low Byte Event0 Timeout',
    bitFields: [
      {
        bits: '7:0',
        name: 'EVENT0[7:0]',
        reset: 107,
        rw: 'R/W',
        desc: 'Low byte of EVENT0 timeout register.\n\nThe default EVENT0 value gives 1.0 s timeout, assuming a 26.0 MHz crystal.'
      }
    ]
  },
  {
    addr: 0x20,
    name: 'WORCTRL',
    description: 'Wake On Radio Control',
    bitFields: [
      { bits: '7', name: 'RC_PD', reset: 1, rw: 'R/W', desc: 'Power down signal to RC oscillator.\nWhen written to 0, automatic initial calibration will be performed.' },
      {
        bits: '6:4',
        name: 'EVENT1[2:0]',
        reset: 7,
        rw: 'R/W',
        desc: 'Timeout setting from register block.\nDecoded to Event 1 timeout.\nRC oscillator clock frequency equals f_XOSC / 750 (34.7–36 kHz depending on crystal frequency).\n\nThe table lists the number of RC clock periods after Event 0 before Event 1 times out.'
      },
      { bits: '3', name: 'RC_CAL', reset: 1, rw: 'R/W', desc: 'Enables (1) or disables (0) the RC oscillator calibration.' },
      { bits: '2', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '1:0',
        name: 'WOR_RES[1:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Controls the Event 0 resolution and maximum timeout of the WOR module under normal RX operation.\n\nNote:\nWOR_RES should be 0 or 1 when using WOR because WOR_RES > 1 yields an extremely low duty cycle.\nIn normal RX operation, all settings can be used.'
      }
    ]
  },
  {
    addr: 0x21,
    name: 'FREND1',
    description: 'Front End RX Configuration',
    bitFields: [
      { bits: '7:6', name: 'LNA_CURRENT[1:0]', reset: 1, rw: 'R/W', desc: 'Adjusts front-end LNA PTAT current output.' },
      { bits: '5:4', name: 'LNA2MIX_CURRENT[1:0]', reset: 1, rw: 'R/W', desc: 'Adjusts front-end PTAT outputs.' },
      { bits: '3:2', name: 'LODIV_BUF_CURRENT_RX[1:0]', reset: 1, rw: 'R/W', desc: 'Adjusts current in RX LO buffer (LO input to mixer).' },
      { bits: '1:0', name: 'MIX_CURRENT[1:0]', reset: 2, rw: 'R/W', desc: 'Adjusts current in mixer.' }
    ]
  },
  {
    addr: 0x22,
    name: 'FREND0',
    description: 'Front End TX Configuration',
    bitFields: [
      { bits: '7:6', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '5:4',
        name: 'LODIV_BUF_CURRENT_TX[1:0]',
        reset: 1,
        rw: 'R/W',
        desc: 'Adjusts current TX LO buffer (input to PA).\nThe value to use is given by SmartRF Studio.'
      },
      { bits: '3', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '2:0',
        name: 'PA_POWER[2:0]',
        reset: 0,
        rw: 'R/W',
        desc: 'Selects PA power setting.\nThis value indexes into the PATABLE, which may contain up to 8 PA settings.\n\nIn OOK/ASK mode:\nWhen transmitting a "1", the PA_POWER index selects the PATABLE entry.\nWhen transmitting a "0", PATABLE index 0 is used.\n\nPATABLE settings from index 0 to PA_POWER are used for ASK TX shaping and for power ramp-up and ramp-down at start/end of TX in all modulation formats.'
      }
    ]
  },
  {
    addr: 0x23,
    name: 'FSCAL3',
    description: 'Frequency Synthesizer Calibration',
    bitFields: [
      {
        bits: '7:6',
        name: 'FSCAL3[7:6]',
        reset: 2,
        rw: 'R/W',
        desc: 'Frequency synthesizer calibration configuration.\nThe correct value is provided by SmartRF Studio.'
      },
      { bits: '5:4', name: 'CHP_CURR_CAL_EN[1:0]', reset: 2, rw: 'R/W', desc: 'Disable charge pump calibration stage when 0.' },
      {
        bits: '3:0',
        name: 'FSCAL3[3:0]',
        reset: 9,
        rw: 'R/W',
        desc: 'Frequency synthesizer calibration result register.\nDigital bit vector defining charge pump output current on an exponential scale:\n\nI_OUT = I_0 · 2^(FSCAL3[3:0] / 4)\n\nFast frequency hopping without calibration can be done by calibrating upfront for each frequency and saving FSCAL3, FSCAL2, and FSCAL1 values.\n\nBetween hops, replace these registers with stored values corresponding to the next RF frequency.'
      }
    ]
  },
  {
    addr: 0x24,
    name: 'FSCAL2',
    description: 'Frequency Synthesizer Calibration',
    bitFields: [
      { bits: '7:6', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '5', name: 'VCO_CORE_H_EN', reset: 0, rw: 'R/W', desc: 'Choose high (1) / low (0) VCO core.' },
      {
        bits: '4:0',
        name: 'FSCAL2[4:0]',
        reset: 10,
        rw: 'R/W',
        desc: 'Frequency synthesizer calibration result register.\nVCO current calibration result and override value.\n\nFast frequency hopping without calibration can be done by:\n• Calibrating upfront for each hop frequency, then saving FSCAL3, FSCAL2, FSCAL1.\n• Between hops, write back these stored values.'
      }
    ]
  },
  {
    addr: 0x25,
    name: 'FSCAL1',
    description: 'Frequency Synthesizer Calibration',
    bitFields: [
      { bits: '7:6', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      {
        bits: '5:0',
        name: 'FSCAL1[5:0]',
        reset: 32,
        rw: 'R/W',
        desc: 'Frequency synthesizer calibration result register.\nCapacitor array setting for VCO coarse tuning.\n\nSame fast-hop usage as FSCAL2:\nSave FSCAL3/FSCAL2/FSCAL1 for each frequency, then restore them on each hop.'
      }
    ]
  },
  {
    addr: 0x26,
    name: 'FSCAL0',
    description: 'Frequency Synthesizer Calibration',
    bitFields: [
      { bits: '7', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '6:0', name: 'FSCAL0[6:0]', reset: 13, rw: 'R/W', desc: 'Frequency synthesizer calibration control.\nValue provided by SmartRF Studio.' }
    ]
  },
  {
    addr: 0x27,
    name: 'RCCTRL1',
    description: 'RC Oscillator Configuration',
    bitFields: [
      { bits: '7', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '6:0', name: 'RCCTRL1[6:0]', reset: 65, rw: 'R/W', desc: 'RC oscillator configuration.' }
    ]
  },
  {
    addr: 0x28,
    name: 'RCCTRL0',
    description: 'RC Oscillator Configuration',
    bitFields: [
      { bits: '7', name: '', reset: 0, rw: 'R', desc: 'Not used' },
      { bits: '6:0', name: 'RCCTRL0[6:0]', reset: 0, rw: 'R/W', desc: 'RC oscillator configuration.' }
    ]
  },
  {
    addr: 0x29,
    name: 'FSTEST',
    description: 'Frequency Synthesizer Calibration Control',
    bitFields: [{ bits: '7:0', name: 'FSTEST[7:0]', reset: 89, rw: 'R/W', desc: 'For test only. Do not write to this register.' }]
  },
  {
    addr: 0x2A,
    name: 'PTEST',
    description: 'Production Test',
    bitFields: [
      {
        bits: '7:0',
        name: 'PTEST[7:0]',
        reset: 127,
        rw: 'R/W',
        desc: 'Writing 0xBF makes the on-chip temperature sensor available in the IDLE state.\nBefore leaving IDLE, write back the default value 0x7F.\n\nOther use of this register is for test only.'
      }
    ]
  },
  {
    addr: 0x2B,
    name: 'AGCTEST',
    description: 'AGC Test',
    bitFields: [{ bits: '7:0', name: 'AGCTEST[7:0]', reset: 63, rw: 'R/W', desc: 'For test only. Do not write to this register.' }]
  },
  {
    addr: 0x2C,
    name: 'TEST2',
    description: 'Various Test Settings',
    bitFields: [
      {
        bits: '7:0',
        name: 'TEST2[7:0]',
        reset: 136,
        rw: 'R/W',
        desc: 'Value is provided by SmartRF Studio software.\n\nWhen waking from SLEEP mode, this register is forced to 0x88 or 0x81, depending on FIFO_THR.ADC_RETENTION.\n\nNote:\nThe value read after waking from SLEEP is always the reset value (0x88), regardless of ADC_RETENTION.\nBit inversion from ADC_RETENTION is internal only.'
      }
    ]
  },
  {
    addr: 0x2D,
    name: 'TEST1',
    description: 'Various Test Settings',
    bitFields: [
      {
        bits: '7:0',
        name: 'TEST1[7:0]',
        reset: 49,
        rw: 'R/W',
        desc: 'Value is provided by SmartRF Studio software.\n\nWhen waking from SLEEP mode, this register is forced to 0x31 or 0x35, depending on FIFO_THR.ADC_RETENTION.\n\nNote:\nThe value read after waking from SLEEP is always the reset value (0x31), regardless of ADC_RETENTION.\nBit inversion from ADC_RETENTION is internal only.'
      }
    ]
  },
  {
    addr: 0x2E,
    name: 'TEST0',
    description: 'Various Test Settings',
    bitFields: [
      { bits: '7:2', name: 'TEST0[7:2]', reset: 2, rw: 'R/W', desc: 'Value provided by SmartRF Studio software.' },
      { bits: '1', name: 'VCO_SEL_CAL_EN', reset: 1, rw: 'R/W', desc: 'Enable VCO selection calibration stage when set to 1.' },
      { bits: '0', name: 'TEST0[0]', reset: 1, rw: 'R/W', desc: 'Value provided by SmartRF Studio software.' }
    ]
  },
  {
    addr: 0x3E,
    name: 'PATABLE[0]',
    description: 'Power Amplifier Table Entry 0',
    bitFields: [
      {
        bits: '7:0',
        name: 'PATABLE[0]',
        reset: 0xc6,
        rw: 'R/W',
        desc: 'PA power control setting for index 0. This is the power level used when FREND0.PA_POWER=0, or for logic 0 in OOK modulation. This value persists through SLEEP state. See Table 37 for recommended settings based on frequency band and desired output power.'
      }
    ]
  }
];

export const REGISTER_DEFINITIONS: RegisterDefinitions = REGISTERS.reduce<RegisterDefinitions>(
  (acc, reg) => {
    acc[reg.addr] = reg;
    return acc;
  },
  {}
);
