# UI TODO

Bu dosya GitHub oncesi temizlik sirasinda gorulen UI gelistirme notlarini tutar. Bu gorevde buyuk UI refactor yapilmadi.

## Ana Sayfa

- Hero alani daha guclu bir ilk izlenim verebilir; Mansur Kavak ve Engineering Lab kimligi ilk ekranda daha net ayrismali.
- Telemetry preview, proje ve blog bloklari ayni cam/kart dilini cok tekrarli kullaniyor; daha ritimli bolum ayrimi gerekli.
- Ana site daha premium, editorial ve kisisel marka odakli hissetmeli.
- CTA hiyerarsisi netlesmeli; `/esp`, `/projects` ve `/blog` ayni agirlikta durmamali.

## ESP Dashboard

- ESP dashboard ana siteden farkli karakterde, daha operasyonel ve yogun bilgi odakli olmali.
- Grafikler su an basit bar preview seviyesinde; zaman serisi, threshold, status history ve device filtreleri gelismeli.
- Sample data durumu daha kontrollu bir empty/loading/error state ile sunulmali.
- Raw payload paneli debug icin iyi, fakat normal kullaniciya daha okunur bir telemetry detail paneli eklenebilir.

## Admin Panel

- Admin panel daha sade bir control plane gibi tasarlanabilir; tablo, filtre, arama ve bulk action kaliplari standartlasmali.
- Dashboard kartlari tek basina veri veriyor, fakat son aktiviteler ve hata durumlari eksik.
- Navigation aktif state ve mobil kullanim daha net olmali.
- Admin formlari success/error state ve field-level validation gorunumu olarak guclendirilmeli.

## Blog ve Proje Kartlari

- Blog/proje kartlari daha premium olabilir; cover image, metadata, okuma suresi, teknoloji swatch ve status badge daha iyi kullanilmali.
- Kartlar arasinda bilgi hiyerarsisi guclenmeli; baslik, ozet ve tag alani daha kontrollu olmali.
- Proje detaylari icin gorsel galeri ve teknik spec bolumu dusunulebilir.

## Tasarim Karakteri

- Ana site: kisisel marka, engineering lab, premium portfolio ve teknik yayin karakteri.
- ESP dashboard: utilitarian, dense, status-heavy, sensor/operator karakteri.
- Admin panel: sakin, hizli taranabilir, tekrarli is akislari icin optimize edilmis control plane.
