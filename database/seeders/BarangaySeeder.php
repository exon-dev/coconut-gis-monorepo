<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Barangay;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = [
            [
                'name' => 'LUCENA',
                'captain' => 'John Doe',
                'contact' => '1234567890',
                'x' => 125.873077,
                'y' => 8.5666,
                'coordinates' => [
                    [14011723.153166886, 956942.4523816301],
                    [14011980.172689075, 956823.0195249346],
                    [14012040.366878008, 956959.6507421527],
                    [14012091.961813783, 956988.3146277596],
                    [14012219.038402466, 956881.3027444228],
                    [14012379.556191023, 957086.7272214912],
                    [14012482.746135471, 957290.2408749069],
                    [14012569.693313463, 957372.4106839582],
                    [14012693.903484426, 957477.5115887383],
                    [14012448.349560218, 957542.4830828272],
                    [14012260.123334328, 957378.1434647244],
                    [14012059.476135079, 957489.932625881],
                    [14011909.468423331, 957365.7224549177],
                    [14011773.792690836, 957390.5644745312],
                    [14011743.21790868, 957319.8602452362],
                    [14011766.148995297, 957279.7307980969],
                    [14011662.959014403, 957220.4920938862],
                    [14011683.97920447, 957177.4962654759],
                    [14011572.190043313, 957038.954078813],
                    [14011723.153166886, 956942.4523816301],
                ],
            ],
            [
                'name' => 'SAN VICENTE',
                'captain' => 'Bobby Doe',
                'contact' => '1234567890',
                'x' => 125.857149,
                'y' => 8.53948,
                'coordinates' => [
                    [14010513.422820944, 954666.5771986657],
                    [14010223.023505894, 954720.0831038862],
                    [14010159.976215215, 954460.197236875],
                    [14010066.360671481, 954460.197236875],
                    [14010031.9712137, 954423.8896192812],
                    [14009953.639832934, 954376.1164766029],
                    [14009944.087221969, 954269.104666162],
                    [14009827.545397341, 954301.5903448662],
                    [14009812.261161491, 954337.8979624601],
                    [14009842.82963319, 954406.6912587583],
                    [14009774.05071763, 954435.3551443652],
                    [14009741.57189865, 954368.4727446157],
                    [14009674.70362189, 954343.6307250023],
                    [14009565.803915188, 954295.857582324],
                    [14009458.814555762, 954301.5903448662],
                    [14009470.277805531, 954192.6676378766],
                    [14009598.282734165, 954186.9348024384],
                    [14009596.372241125, 954007.3078297059],
                    [14009724.37716976, 954011.1296956993],
                    [14009730.108794644, 953802.8386915678],
                    [14009894.4136741, 953692.0050151334],
                    [14010880.24295084, 953648.0537384485],
                    [14010996.784775468, 954571.0308404128],
                    [14010513.422820944, 954666.5771986657],
                ],
            ],
            [
                'name' => 'SAN PEDRO',
                'captain' => 'Kevin Durant',
                'contact' => '1234567890',
                'x' => 125.885786,
                'y' => 8.551695,
                'coordinates' => [
                    [14013215.92113812, 956085.9829264792],
                    [14012948.305047797, 955777.7539153813],
                    [14013051.026442058, 955607.416845229],
                    [14013005.072047263, 955493.8587640807],
                    [14012821.254983673, 955501.9700334897],
                    [14012756.378324468, 955369.4856914338],
                    [14012956.414604418, 955220.7787074192],
                    [14013567.336152058, 955196.4445897707],
                    [14013537.601076743, 954961.2173643459],
                    [14013794.404356157, 954782.7690247846],
                    [14014051.207635574, 954796.2878415132],
                    [14014124.193748282, 955810.1990961579],
                    [14013215.92113812, 956085.9829264792],
                ],
            ],
            [
                'name' => 'NAPO',
                'captain' => 'Lebron James',
                'contact' => '1234567890',
                'x' => 125.897592,
                'y' => 8.544228,
                'coordinates' => [
                    [14014514.32769729, 954838.6592292766],
                    [14014680.5431791, 955051.727456556],
                    [14015107.544860113, 955041.2173615221],
                    [14015111.365919078, 955076.5694761693],
                    [14015263.252448007, 955024.9744857216],
                    [14015484.296002358, 954750.759777023],
                    [14015243.570162296, 954562.5336240288],
                    [14015252.167526742, 954521.4487286151],
                    [14015239.749176215, 954446.9226333266],
                    [14014976.814382551, 954311.7250257371],
                    [14014878.359665362, 954232.9936645807],
                    [14014452.313267307, 954549.2518180832],
                    [14014321.44248979, 954650.530938878],
                    [14014514.32769729, 954838.6592292766],
                ],
            ],
            [
                'name' => 'LA SUERTE',
                'captain' => 'Kobe Bryant',
                'contact' => '1234567890',
                'x' => 125.896321,
                'y' => 8.579757,
                'coordinates' => [
                    [14014793.371957596, 959380.9430358143],
                    [14015429.45258507, 958248.4805319832],
                    [14015007.09508725, 957866.7515490227],
                    [14014806.093570147, 958169.5897201787],
                    [14014668.700115789, 958021.9879632618],
                    [14014330.305241385, 958441.8898445183],
                    [14014228.53234099, 958597.1262587574],
                    [14014325.216576954, 958632.7543359986],
                    [14014205.633399578, 958976.3104206629],
                    [14014396.45758782, 959047.5664780665],
                    [14014307.406299973, 959319.8665053273],
                    [14014729.76389485, 959482.7375283492],
                    [14014793.371957596, 959380.9430358143],
                ],
            ],
            [
                'name' => 'LAS NAVAS',
                'captain' => 'Michael Jordan',
                'contact' => '1234567890',
                'x' => 125.908064,
                'y' => 8.560977,
                'coordinates' => [
                    [14016125.933514416, 956916.4030491115],
                    [14015953.986517034, 956952.7106667054],
                    [14015860.370900419, 956740.5979059244],
                    [14015776.30796765, 956610.6549724188],
                    [14015814.518484393, 956599.1893744385],
                    [14015827.892081441, 956566.703622838],
                    [14015787.771071656, 956482.6229354619],
                    [14015705.618631927, 956492.1775639976],
                    [14015610.092522271, 956318.2832809112],
                    [14016091.544202397, 956052.6646513578],
                    [14016318.89622677, 956304.9068592781],
                    [14016519.501057047, 957126.6048768958],
                    [14016030.40740476, 957229.7948760152],
                    [14015967.360259844, 956994.7510103934],
                    [14016125.933514416, 956916.4030491115],
                ],
            ],
            [
                'name' => 'MAPAGA',
                'captain' => 'Stephen Curry',
                'contact' => '1234567890',
                'x' => 125.885083,
                'y' => 8.594102,
                'coordinates' => [
                    [14013284.731141934, 960561.6734829682],
                    [14014998.590975896, 960609.8257934322],
                    [14014921.563988574, 959800.8668306886],
                    [14012360.401417335, 959887.5411364728],
                    [14012398.915278291, 960523.1514876479],
                    [14013284.731141934, 960561.6734829682],
                ],
            ],
            [
                'name' => 'AWA',
                'captain' => 'Kevin Garnett',
                'contact' => '1234567890',
                'x' => 125.906792,
                'y' => 8.641974,
                'coordinates' => [
                    [14015701.720911525, 965974.6833209276],
                    [14016725.091395535, 965855.815106401],
                    [14016622.754384913, 965334.1160773021],
                    [14016404.875531232, 965393.5501215868],
                    [14016404.875531232, 965297.7953074496],
                    [14015635.697001206, 965284.5876860721],
                    [14015638.99814635, 965423.2672067077],
                    [14015302.276178537, 965433.1728597623],
                    [14015275.866639595, 965753.456481575],
                    [14015226.348706856, 966024.2117121577],
                    [14015701.720911525, 965974.6833209276],
                ],
            ],
            [
                'name' => 'AURORA',
                'captain' => 'Dwyane Wade',
                'contact' => '1234567890',
                'x' => 125.840243,
                'y' => 8.590985,
                'coordinates' => [
                    [14008312.95994094, 960407.8729891356],
                    [14008270.928438114, 960333.3468573991],
                    [14008290.033660045, 960316.1485333246],
                    [14008267.107379152, 960291.3064408151],
                    [14008200.239102393, 960319.970326422],
                    [14008007.276390038, 960075.3718869367],
                    [14007944.229099361, 959970.2709730446],
                    [14008013.007942043, 959865.1700591524],
                    [14007917.481832387, 959826.9515450099],
                    [14008175.402328458, 959647.3245722773],
                    [14008270.928438114, 959586.17493507],
                    [14008471.533268392, 959471.5193926422],
                    [14008460.070164386, 959383.6168392727],
                    [14008576.611989016, 959293.8032435623],
                    [14008974.00066349, 959169.5930725989],
                    [14009277.773575587, 959593.8185941608],
                    [14009147.858153911, 959702.7413740464],
                    [14009166.963375844, 959786.8221343185],
                    [14008379.828144819, 960520.6175985666],
                    [14008293.854719007, 960384.9418660708],
                    [14008312.95994094, 960407.8729891356],
                ],
            ],
            [
                'name' => 'SAN JOAQUIN',
                'captain' => 'Chris Paul',
                'contact' => '1234567890',
                'x' => 125.891422,
                'y' => 8.635346,
                'coordinates' => [
                    [14016020.28827897, 965047.2523787953],
                    [14011992.907437554, 965421.7939340264],
                    [14012099.896796979, 963893.0530767387],
                    [14016341.256357241, 963923.6282962705],
                    [14016364.182273732, 964542.7675255786],
                    [14016020.28827897, 965047.2523787953],
                ],
            ],
        ];

        foreach ($barangays as $barangay) {
            Barangay::create([
                'barangay_name' => $barangay['name'],
                'barangay_captain' => $barangay['captain'],
                'barangay_contact' => $barangay['contact'],
                'x_coordinate' => $barangay['x'],
                'y_coordinate' => $barangay['y'],
                'coordinate_points' => json_encode($barangay['coordinates']),
            ]);
        }
    }
}
