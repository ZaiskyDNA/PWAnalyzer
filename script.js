// Function to toggle password visibility
function togglePasswordVisibility() {
            const passwordInput = document.getElementById('passwordInput');
            const eyeIcon = document.getElementById('eyeIcon');
            const eyeOffIcon = document.getElementById('eyeOffIcon');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        } 
// Password Strength Analyzer
class PasswordAnalyzer {
    constructor() {
        this.commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 
            'password123', 'admin', 'letmein', 'welcome', 'test123',
            'anjing', 'bubub', 'hello', 'login', 'pass', 'admin123',
            '12345678', '1234567890', 'qwertyuiop', 'asdfghjkl', 
            'trustno1', '1234567', '123123', 'qwerty123', '1q2w3e4r',
            'sayang', 'rahasia', 'secret', '000000','111111', 'google',
            'iloveyou', 'bismillah', 'indonesia', 
        ];
        
        this.keyboardPatterns = [
            'qwerty', 'asdf', 'zxcv', '1234', 'abcd', 'qwertyuiop',
            'asdfghjkl', 'zxcvbnm', '1234567890'
        ];
        
        this.personalInfo = [
            'nama', 'lahir', 'tanggal', 'bulan', 'tahun', 'alamat'
        ];
    }

    analyzePassword(password) {
        const analysis = {
            score: 0,
            strength: '',
            feedback: [],
            details: {
                length: password.length,
                hasLowercase: /[a-z]/.test(password),
                hasUppercase: /[A-Z]/.test(password),
                hasNumbers: /\d/.test(password),
                hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
                hasSpaces: /\s/.test(password),
                isCommon: this.isCommonPassword(password),
                hasKeyboardPattern: this.hasKeyboardPattern(password),
                hasRepeatingChars: this.hasRepeatingChars(password),
                hasSequentialChars: this.hasSequentialChars(password),
                entropy: this.calculateEntropy(password),
                estimatedCrackTime: ''
            }
        };

        // Analisis berdasarkan panjang
        this.analyzeLengthCriteria(password, analysis);
        
        // Analisis karakter
        this.analyzeCharacterCriteria(password, analysis);
        
        // Analisis pola dan keamanan
        this.analyzeSecurityCriteria(password, analysis);
        
        // Hitung skor akhir dan kekuatan
        this.calculateFinalScore(analysis);
        
        // Estimasi waktu crack
        this.estimateCrackTime(analysis);
        
        return analysis;
    }

    analyzeLengthCriteria(password, analysis) {
        const length = password.length;
        
        if (length < 6) {
            analysis.feedback.push('❌ Password terlalu pendek (minimal 6 karakter)');
        } else if (length < 8) {
            analysis.score += 10;
            analysis.feedback.push('⚠️ Password pendek (disarankan minimal 8 karakter)');
        } else if (length < 12) {
            analysis.score += 20;
            analysis.feedback.push('✅ Panjang password cukup baik');
        } else if (length < 16) {
            analysis.score += 25;
            analysis.feedback.push('✅ Panjang password baik');
        } else {
            analysis.score += 30;
            analysis.feedback.push('✅ Panjang password sangat baik');
        }
    }

    analyzeCharacterCriteria(password, analysis) {
        const { details } = analysis;
        
        // Huruf kecil
        if (details.hasLowercase) {
            analysis.score += 5;
            analysis.feedback.push('✅ Mengandung huruf kecil');
        } else {
            analysis.feedback.push('❌ Tidak mengandung huruf kecil');
        }
        
        // Huruf besar
        if (details.hasUppercase) {
            analysis.score += 5;
            analysis.feedback.push('✅ Mengandung huruf besar');
        } else {
            analysis.feedback.push('❌ Tidak mengandung huruf besar');
        }
        
        // Angka
        if (details.hasNumbers) {
            analysis.score += 5;
            analysis.feedback.push('✅ Mengandung angka');
        } else {
            analysis.feedback.push('❌ Tidak mengandung angka');
        }
        
        // Karakter khusus
        if (details.hasSpecialChars) {
            analysis.score += 10;
            analysis.feedback.push('✅ Mengandung karakter khusus');
        } else {
            analysis.feedback.push('❌ Tidak mengandung karakter khusus (!@#$%^&*)');
        }
        
        // Spasi (bonus kecil)
        if (details.hasSpaces) {
            analysis.score += 2;
            analysis.feedback.push('✅ Mengandung spasi (passphrase)');
        }
    }

    analyzeSecurityCriteria(password, analysis) {
        const { details } = analysis;
        
        // Password umum
        if (details.isCommon) {
            analysis.score -= 20;
            analysis.feedback.push('❌ Password terlalu umum dan mudah ditebak');
        } else {
            analysis.score += 10;
            analysis.feedback.push('✅ Bukan password yang umum digunakan');
        }
        
        // Pola keyboard
        if (details.hasKeyboardPattern) {
            analysis.score -= 15;
            analysis.feedback.push('❌ Mengandung pola keyboard yang mudah ditebak');
        } else {
            analysis.score += 5;
            analysis.feedback.push('✅ Tidak mengandung pola keyboard');
        }
        
        // Karakter berulang
        if (details.hasRepeatingChars) {
            analysis.score -= 10;
            analysis.feedback.push('⚠️ Mengandung karakter yang berulang berturut-turut');
        } else {
            analysis.score += 5;
            analysis.feedback.push('✅ Tidak ada karakter berulang berturut-turut');
        }
        
        // Karakter berurutan
        if (details.hasSequentialChars) {
            analysis.score -= 15;
            analysis.feedback.push('❌ Mengandung karakter berurutan (abc, 123)');
        } else {
            analysis.score += 5;
            analysis.feedback.push('✅ Tidak mengandung urutan karakter');
        }
        
        // Entropy bonus
        if (details.entropy > 50) {
            analysis.score += 10;
            analysis.feedback.push('✅ Tingkat keacakan tinggi');
        } else if (details.entropy > 30) {
            analysis.score += 5;
            analysis.feedback.push('✅ Tingkat keacakan cukup');
        }
    }

    calculateFinalScore(analysis) {
        // Normalisasi skor ke range 0-100
        analysis.score = Math.max(0, Math.min(100, analysis.score));
        
        if (analysis.score < 30) {
            analysis.strength = 'Sangat Lemah';
        } else if (analysis.score < 50) {
            analysis.strength = 'Lemah';
        } else if (analysis.score < 70) {
            analysis.strength = 'Sedang';
        } else if (analysis.score < 85) {
            analysis.strength = 'Kuat';
        } else {
            analysis.strength = 'Sangat Kuat';
        }
    }

    isCommonPassword(password) {
        const lower = password.toLowerCase();
        return this.commonPasswords.some(common => 
            lower.includes(common) || common.includes(lower)
        );
    }

    hasKeyboardPattern(password) {
        const lower = password.toLowerCase();
        return this.keyboardPatterns.some(pattern => 
            lower.includes(pattern) || lower.includes(pattern.split('').reverse().join(''))
        );
    }

    hasRepeatingChars(password) {
        return /(.)\1{2,}/.test(password);
    }

    hasSequentialChars(password) {
        const sequences = [
            'abcdefghijklmnopqrstuvwxyz',
            '0123456789',
            'qwertyuiopasdfghjklzxcvbnm'
        ];
        
        const lower = password.toLowerCase();
        
        for (let seq of sequences) {
            for (let i = 0; i <= seq.length - 3; i++) {
                const subseq = seq.substring(i, i + 3);
                const reverse = subseq.split('').reverse().join('');
                if (lower.includes(subseq) || lower.includes(reverse)) {
                    return true;
                }
            }
        }
        return false;
    }

    calculateEntropy(password) {
        let charSpace = 0;
        if (/[a-z]/.test(password)) charSpace += 26;
        if (/[A-Z]/.test(password)) charSpace += 26;
        if (/\d/.test(password)) charSpace += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charSpace += 32;
        if (/\s/.test(password)) charSpace += 1;
        
        return password.length * Math.log2(charSpace);
    }

    estimateCrackTime(analysis) {
        const { entropy } = analysis.details;
        const combinations = Math.pow(2, entropy);
        
        // Asumsi: 1 miliar percobaan per detik
        const seconds = combinations / (2 * 1000000000);
        
        if (seconds < 1) {
            analysis.details.estimatedCrackTime = 'Kurang dari 1 detik';
        } else if (seconds < 60) {
            analysis.details.estimatedCrackTime = `${Math.round(seconds)} detik`;
        } else if (seconds < 3600) {
            analysis.details.estimatedCrackTime = `${Math.round(seconds / 60)} menit`;
        } else if (seconds < 86400) {
            analysis.details.estimatedCrackTime = `${Math.round(seconds / 3600)} jam`;
        } else if (seconds < 31536000) {
            analysis.details.estimatedCrackTime = `${Math.round(seconds / 86400)} hari`;
        } else if (seconds < 31536000000) {
            analysis.details.estimatedCrackTime = `${Math.round(seconds / 31536000)} tahun`;
        } else {
            analysis.details.estimatedCrackTime = 'Lebih dari 1000 tahun';
        }
    }

    // Fungsi untuk mendapatkan saran perbaikan
    getSuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.details.length < 12) {
            suggestions.push('Gunakan minimal 12 karakter untuk keamanan optimal');
        }
        
        if (!analysis.details.hasUppercase || !analysis.details.hasLowercase) {
            suggestions.push('Kombinasikan huruf besar dan kecil');
        }
        
        if (!analysis.details.hasNumbers) {
            suggestions.push('Tambahkan angka dalam password');
        }
        
        if (!analysis.details.hasSpecialChars) {
            suggestions.push('Gunakan karakter khusus seperti !@#$%^&*');
        }
        
        if (analysis.details.isCommon) {
            suggestions.push('Hindari password yang umum digunakan');
        }
        
        if (analysis.details.hasKeyboardPattern) {
            suggestions.push('Hindari pola keyboard seperti qwerty atau 123456');
        }
        
        if (analysis.details.hasRepeatingChars) {
            suggestions.push('Hindari pengulangan karakter berturut-turut');
        }
        
        if (analysis.details.hasSequentialChars) {
            suggestions.push('Hindari urutan karakter seperti abc atau 123');
        }
        
        suggestions.push('Pertimbangkan menggunakan passphrase dengan 4-6 kata acak');
        suggestions.push('Gunakan password manager untuk menghasilkan password yang kuat');
        
        return suggestions;
    }
}

// Fungsi untuk menghubungkan dengan HTML
function setupPasswordAnalyzer() {
    const analyzer = new PasswordAnalyzer();
    const passwordInput = document.getElementById('passwordInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultDiv = document.getElementById('result');
    
    function analyzePassword() {
        const password = passwordInput.value;
        
        if (!password) {
            resultDiv.innerHTML = '<p style="color:rgb(255, 0, 0);">*Masukkan password untuk dianalisis!!</p>';
            return;
        }
        
        const analysis = analyzer.analyzePassword(password);
        const suggestions = analyzer.getSuggestions(analysis);
        
        // Warna berdasarkan kekuatan
        let strengthColor = '#f44336'; // Merah untuk lemah
        if (analysis.score >= 70) strengthColor = '#51cf66'; // Hijau untuk kuat
        else if (analysis.score >= 50) strengthColor = '#ffd43b'; // Kuning untuk sedang
        
        // HTML hasil analisis dengan Tailwind CSS & tema hitam-hijau
        let resultHTML = `
        <div class="mb-5 p-4 rounded-lg bg-gray-900 border border-green-700">
            <h3 class="mb-2 text-lg font-semibold" style="color: ${strengthColor};">
            Kekuatan: ${analysis.strength} (${analysis.score}/100)
            </h3>
            <div class="bg-green-900 rounded-md h-2 overflow-hidden">
            <div class="h-full transition-all duration-300 ease-in-out" style="background-color: ${strengthColor}; width: ${analysis.score}%;"></div>
            </div>
        </div>

        <div class="mb-5">
            <h4 class="text-green-400 font-semibold mb-2">📊 Detail Analisis:</h4>
            <ul class="ml-5 list-disc text-white space-y-1">
            <li>Panjang: ${analysis.details.length} karakter</li>
            <li>Entropy: ${Math.round(analysis.details.entropy)} bits</li>
            <li>Estimasi waktu crack: ${analysis.details.estimatedCrackTime}</li>
            </ul>
        </div>

        <div class="mb-5">
            <h4 class="text-green-400 font-semibold mb-2">✅ Hasil Pengecekan:</h4>
            <div class="ml-5 list-disc text-white space-y-1">
            ${analysis.feedback.map(fb => `<p>${fb}</p>`).join('')}
            </div>
        </div>

        <div>
            <h4 class="text-green-400 font-semibold mb-2">💡Saran Perbaikan:</h4>
            <ul class="ml-5 list-disc text-white space-y-1">
            ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        </div>
        `;

        resultDiv.innerHTML = resultHTML;
        }
    
    // Event listeners
    analyzeBtn.addEventListener('click', analyzePassword);
    passwordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            analyzePassword();
        }
        // Real-time analysis (opsional)
        if (passwordInput.value.length > 0) {
            analyzePassword();
        }
    });
}

// Inisialisasi ketika DOM sudah siap
document.addEventListener('DOMContentLoaded', setupPasswordAnalyzer);