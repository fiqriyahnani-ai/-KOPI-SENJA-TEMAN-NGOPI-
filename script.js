
document.addEventListener("DOMContentLoaded", function () {
  // =====================================
  // 1. MENGAMBIL ELEMEN HTML
  // =====================================
  const tombolFilter = document.querySelectorAll(".filter-btn");
  const kartuMenu = document.querySelectorAll(".menu-card");
  const tombolTambah = document.querySelectorAll(".btn-tambah");

  const isiKeranjang = document.getElementById("isi-keranjang");
  const jumlahItem = document.getElementById("jumlah-item");
  const totalHarga = document.getElementById("total-harga");
  const tombolKosongkan = document.getElementById("kosongkan");

  // Menyimpan pesanan
  let keranjang = [];

  // =====================================
  // 2. FILTER KATEGORI MENU
  // =====================================
  tombolFilter.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      const kategoriDipilih = tombol.dataset.filter;

      // Mengatur tombol yang aktif
      tombolFilter.forEach(function (btn) {
        btn.classList.remove("active");
      });

      tombol.classList.add("active");

      // Menampilkan menu berdasarkan kategori
      kartuMenu.forEach(function (kartu) {
        const kategoriMenu = kartu.dataset.category;

        if (
          kategoriDipilih === "all" ||
          kategoriMenu === kategoriDipilih
        ) {
          kartu.style.display = "";
        } else {
          kartu.style.display = "none";
        }
      });
    });
  });

  // =====================================
  // 3. FORMAT HARGA RUPIAH
  // =====================================
  function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
  }

  // =====================================
  // 4. MENAMPILKAN KERANJANG
  // =====================================
  function tampilkanKeranjang() {
    isiKeranjang.innerHTML = "";

    let jumlahTotalItem = 0;
    let hargaTotal = 0;

    if (keranjang.length === 0) {
      const pesanKosong = document.createElement("p");
      pesanKosong.className = "kosong";
      pesanKosong.textContent = "Keranjang masih kosong.";
      isiKeranjang.appendChild(pesanKosong);
    }

    keranjang.forEach(function (item, index) {
      jumlahTotalItem += item.qty;
      hargaTotal += item.harga * item.qty;

      // Baris produk dalam keranjang
      const baris = document.createElement("div");
      baris.className = "item-keranjang";

      const namaProduk = document.createElement("span");
      namaProduk.className = "item-kiri";
      namaProduk.textContent =
        item.nama + " — " +
        formatRupiah(item.harga * item.qty);

      // Tombol pengatur jumlah
      const aksi = document.createElement("div");
      aksi.className = "item-aksi";

      const tombolKurang = document.createElement("button");
      tombolKurang.type = "button";
      tombolKurang.textContent = "−";
      tombolKurang.setAttribute("aria-label", "Kurangi " + item.nama);

      const angkaJumlah = document.createElement("span");
      angkaJumlah.textContent = item.qty;

      const tombolPlus = document.createElement("button");
      tombolPlus.type = "button";
      tombolPlus.textContent = "+";
      tombolPlus.setAttribute("aria-label", "Tambah " + item.nama);

      // Mengurangi jumlah produk
      tombolKurang.addEventListener("click", function () {
        item.qty--;

        if (item.qty <= 0) {
          keranjang.splice(index, 1);
        }

        tampilkanKeranjang();
      });

      // Menambah jumlah produk dari keranjang
      tombolPlus.addEventListener("click", function () {
        item.qty++;
        tampilkanKeranjang();
      });

      aksi.appendChild(tombolKurang);
      aksi.appendChild(angkaJumlah);
      aksi.appendChild(tombolPlus);

      baris.appendChild(namaProduk);
      baris.appendChild(aksi);

      isiKeranjang.appendChild(baris);
    });

    // Memperbarui jumlah dan total harga
    jumlahItem.textContent = jumlahTotalItem;
    totalHarga.textContent = formatRupiah(hargaTotal);
  }

  // =====================================
  // 5. TOMBOL TAMBAH MENU
  // =====================================
  tombolTambah.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      const namaProduk = tombol.dataset.name;
      const hargaProduk = Number(tombol.dataset.price);

      // Memeriksa nama dan harga
      if (
        !namaProduk ||
        !Number.isFinite(hargaProduk) ||
        hargaProduk <= 0
      ) {
        alert("Nama atau harga menu belum benar.");
        return;
      }

      // Memeriksa apakah produk sudah ada
      const produkDitemukan = keranjang.find(function (item) {
        return item.nama === namaProduk;
      });

      if (produkDitemukan) {
        produkDitemukan.qty++;
      } else {
        keranjang.push({
          nama: namaProduk,
          harga: hargaProduk,
          qty: 1
        });
      }

      // Memperbarui tampilan keranjang
      tampilkanKeranjang();

      // Umpan balik sederhana
      const teksAsli = tombol.textContent;
      tombol.textContent = "✓ Ditambahkan";

      setTimeout(function () {
        tombol.textContent = teksAsli;
      }, 700);
    });
  });

  // =====================================
  // 6. KOSONGKAN KERANJANG
  // =====================================
  if (tombolKosongkan) {
    tombolKosongkan.addEventListener("click", function () {
      if (keranjang.length === 0) {
        alert("Keranjang masih kosong.");
        return;
      }

      keranjang = [];
      tampilkanKeranjang();
    });
  }

  // =====================================
  // 7. TOMBOL PESAN SEKARANG
  // =====================================
  const tombolPesan = document.querySelector(".pesan");

  if (tombolPesan) {
    tombolPesan.addEventListener("click", function (event) {
      event.preventDefault();

      document.getElementById("keranjang").scrollIntoView({
        behavior: "smooth"
      });
    });
  }

  // =====================================
  // 8. TAMPILKAN KERANJANG SAAT PERTAMA
  // =====================================
  tampilkanKeranjang();
});
