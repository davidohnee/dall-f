<html>
<a href="/">Go back</a>
<?php
if (!(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['age']) && $_POST['title'])) {
    echo "<p>400 - Bad Request (missing parameters)</p>";
    return;
}

// Get the data from the form
$name = $_POST['name'];
$email = $_POST['email'];
$age = $_POST['age'];
$title = $_POST['title'];

// Check if the data is valid
if (empty($name) || empty($email) || empty($age) || empty($title)) {
    echo "<p>400 - Bad Request (empty)</p>";
    return;
}

// Check if the age is valid
if (!is_numeric($age)) {
    echo "<p>400 - Bad Request (age)</p>";
    return;
}

// Check if the age is valid
if ($age < 18 || $age > 120) {
    echo "<p>400 - Bad Request (age)</p>";
    return;
}

// Check if the email is valid
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<p>400 - Bad Request (email)</p>";
    return;
}

$numberOfArtworks = 0;
if (isset($_COOKIE["artworks"])) {
    $numberOfArtworks = $_COOKIE["artworks"];
}
$numberOfArtworks++;

setcookie("artworks", $numberOfArtworks, time() + 3600 * 24 * 30);

echo "<p>Thank you, $name, for submitting \"$title\"!</p>";
echo "<p>This is submission #$numberOfArtworks from you this month.</p>";
echo "<p>Once processed, you will be sent your rating to $email.</p>";
?>
</html>
