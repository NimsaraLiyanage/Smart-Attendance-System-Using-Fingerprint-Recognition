class BluetoothService {
    constructor() {
      this.device = null;
      this.server = null;
      this.service = null;
      this.characteristic = null;
    }
  
    async connect() {
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not available in your browser');
      }
  
      try {
        this.device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'] }] // Replace with your service UUID
        });
  
        this.server = await this.device.gatt.connect();
        this.service = await this.server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b'); // Replace with your service UUID
        this.characteristic = await this.service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8'); // Replace with your characteristic UUID
  
        return { success: true, message: 'Connected to Bluetooth device' };
      } catch (error) {
        console.error('Bluetooth connection failed:', error);
        throw error;
      }
    }
  
    async getFingerprint() {
      if (!this.characteristic) {
        throw new Error('Bluetooth is not connected');
      }
  
      try {
        const value = await this.characteristic.readValue();
        const fingerprintId = value.getUint16(0, true);
        
        return { id: fingerprintId, timestamp: new Date() };
      } catch (error) {
        console.error('Failed to read fingerprint:', error);
        throw error;
      }
    }
  
    async disconnect() {
      if (this.device && this.device.gatt.connected) {
        await this.device.gatt.disconnect();
      }
      this.device = null;
      this.server = null;
      this.service = null;
      this.characteristic = null;
    }
  }
  
  export default new BluetoothService();