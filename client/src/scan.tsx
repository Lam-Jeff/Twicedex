import { useState, useEffect } from "react";
async function hasCamera(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((d) => d.kind === "videoinput");
  } catch {
    return false;
  }
}
export const Scan = () => {
  const [cameraAvailable, setCameraAvailable] = useState(false);

  useEffect(() => {
    hasCamera().then(setCameraAvailable);
  }, []);

  if (!cameraAvailable) {
    return (
      <div>
        <p>Caméra non disponible sur cet appareil.</p>
        <input type="file" accept="image/*" onChange={() => {}} />
        {/* Galerie uniquement sur desktop */}
      </div>
    );
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={() => {}}
      />
      {/* Caméra + galerie sur mobile */}
    </div>
  );
};
