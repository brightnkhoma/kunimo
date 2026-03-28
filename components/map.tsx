// // components/Map.tsx

// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Custom red dot icon to match the dark theme and avoid Next.js default icon path issues
// const disasterIcon = L.divIcon({
//   className: 'custom-div-icon',
//   html: "<div style='background-color:#ef4444; width:15px; height:15px; border-radius:50%; border: 2px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);'></div>",
//   iconSize: [15, 15],
//   iconAnchor: [7, 7]
// });

// export default function Map({ incidents }) {
//   return (
//     <MapContainer 
//       center={[-13.2543, 34.3015]} 
//       zoom={6.8} 
//       className="w-full h-full rounded-lg z-0"
//     >
//       {/* Dark mode map tiles from CartoDB */}
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
//         url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//       />
      
//       {incidents.map((inc) => (
//         <Marker key={inc.id} position={[inc.lat, inc.lng]} icon={disasterIcon}>
//           <Popup>
//             <div className="text-gray-900">
//               <h3 className="font-bold text-lg mb-1">{inc.type}</h3>
//               <p className="mb-2 text-sm">{inc.desc}</p>
//               {inc.img && (
//                 <img src={inc.img} alt="Disaster" className="w-full h-32 object-cover rounded" />
//               )}
//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }